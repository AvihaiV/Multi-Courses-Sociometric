// Host of your Neo4j installation
const NEO4J_HOST = 'bolt://localhost:7687';

// Credentails of your Neo4j
const NEO4J_USERNAME="neo4j"
const NEO4J_PASSWORD="neo4j1"

// Create a driver to connect to the Neo4j database
const driver = neo4j.v1.driver(NEO4J_HOST, neo4j.v1.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD));
// Create a session to execute the query.
const session = driver.session();


// Create a function to get all soldiers count
function getSoldiersCount(){
	var query = 'MATCH (sold:Soldier) return count(sold) as count';
	session.run(query).then( function (result) {
		// Iterate over all the records
		result.records.forEach(function (record) {
			//console.log( record.get('name'), ":", record.get('screen_name') );
			console.log('Total Soldiers:',record.get('count').low);
		});
		// Close the neo4j session
		//session.close();
	}).catch(function (error) {
		console.log(error);
	});
}

//Function to add new soldier to neo4j
function addSoldier(soldier){
	// Construct a Neo4j Query to add soldier (If soldier not exists else merge the details)
	var query = 'MERGE (soldier:Soldier {name : {name} }) RETURN soldier.name AS name';

	// Run query using session
	session.run(query,soldier).then( function (result) {
		// log success message
		console.log("Success")

		// Get soldier count
		getSoldiersCount();

		// Close the neo4j session
		//session.close();
	}).catch(function (error) {
		console.log(error);
	});
}

// Function to add grade for soldier to neo4j
function addGradeToNeo4j(grades){
	// Add grade giving soldier if not exists
	var soldier={'name':grades.gradeFrom}
	addSoldier(soldier);

	// Construct a Neo4j Query to add grades to a soldier
	//var query = 'MATCH (from:Soldier),(to:Soldier) WHERE from.name = {gradeFrom} AND to.name = {gradeTo} CREATE (from)-[r:GRADED { course: {course},grade:{grade} }]->(to)'
	//var query = 'MATCH (from:Soldier)-[]->(to:Soldier) WHERE from.name = {gradeFrom} AND to.name = {gradeTo} CREATE (from)-[r:GRADED { course: {course},grade:{grade} }]->(to)'
	var query = 'MATCH (from:Soldier),(to:Soldier) WHERE from.name = {gradeFrom} AND to.name = {gradeTo} MERGE (from)-[r:GRADED { course: {course}}]->(to) SET r.grade={grade}';

	// Run query using session
	session.run(query,grades).then( function (result) {
		// Close the neo4j session
		//session.close();
	}).catch(function (error) {
		console.log(error);
	});
}

// Function to get soldier data based on filter
function getSoldierData(filters){
	var response=[];

	// Construct a Neo4j Query to get grades of a soldier
	var query = 'MATCH (s1:Soldier{'
	+ (""!=filters.name?'name:{name}':'')
	+ '})<-[g:GRADED{'
	+ ((""!=filters.grade && false==isNaN(filters.grade))?'grade:{grade}':'')
	+ ((""!=filters.grade && ""!=filters.course && false==isNaN(filters.grade))? ',':'')
	+ (""!=filters.course?'course:{course}':'')
	+ '}]-(s2:Soldier) return s1.name as name,s2.name as graded_by, g.grade as grade, g.course as course ORDER BY name, grade DESC';

	// Run query using session
	session.run(query,filters).then( function (result) {
		// Close the neo4j session
		result.records.forEach(function (record) {
			//console.log( record.get('name'), ":", record.get('grade'),":", record.get('course') );
			var obj={};
			obj['name']=record.get('name')
			obj['graded_by']=record.get('graded_by')
			obj['course']=record.get('course')
			obj['grade']=record.get('grade')
			response.push(obj);
		});

		// Empty previous table
		document.getElementById("outputTable").innerHTML=""

		// Check if result has records then call to draw table function else alert no data
		if(response.length > 0){
			drawTable(response);
		}else{
			// Empty the output table
			//document.getElementById("outputTable").innerHTML=""
			// Please write your own alert here.
			alert('No data available for the applied filters!');
		}
		console.log("SUCCESS");
	}).catch(function (error) {
		console.log(error);
	});
}

// Function to draw output table
function drawTable(data) {
	// Define Header for table graded_by
	header={
		'name':'Soldier ID',
		'graded_by':'Graded By',
		'course':'Course',
		'grade':'Grade'
	}
	// Call a function to draw row
	drawRow(header)
	for (var i = 0; i < data.length; i++) {
        drawRow(data[i]);
    }
	$("#outputTable").addClass("table");

}

// Function to draw row
function drawRow(rowData) {
    var row = $("<tr />")
    $("#outputTable").append(row); //this will append tr element to table... keep its reference for a while since we will add cels into it
    row.append($("<td>" + rowData.name + "</td>"));
    row.append($("<td>" + rowData.graded_by + "</td>"));
    row.append($("<td>" + rowData.course + "</td>"));
    row.append($("<td>" + rowData.grade + "</td>"));
}

//========================================================================================


var pNumbers= [];
var grades= [];
var sum=0;
var i=0;
var calc=0;

function inputData()
{
	var perNum =document.getElementById("personalNum").value;
	var courNum=document.getElementById("courNum").value;
	// Create soldier object
	var soldier={
		'name':perNum,
	}
	// Call funcction to add soldier
	addSoldier(soldier);
}

function addGrade(){

    pNumbers[i]=document.getElementById("perNum").value;
    grades[i]=parseInt(document.getElementById("grade").value);
    sum+=grades[i];
	// Soldier who is giving grade
	var from = pNumbers[i];
	// Grade
	var grade = grades[i]
    i++;

    //alert(sum);

	// Soldier to whom grade is given
	var to = document.getElementById("personalNum").value;
	// the course for which this grade is for
	var courNum=document.getElementById("courNum").value;

	// create grades object
	var grade={
		'gradeTo':to,
		'gradeFrom':from,
		'course':courNum,
		'grade':grade
	}
	addGradeToNeo4j(grade);
}


function newGrade()
{
    document.getElementById("perNum").value="";
    document.getElementById("grade").value="";
}

function calcGrade()
{
    calc= sum/i;
    var text;
    text=   "הציון המשוקלל הוא:  " + calc;
    document.getElementById("calculation").innerHTML = text;

}

function outputData() {
	var personalNum = document.getElementById("perNumOut").value;
	var courNum = document.getElementById("courNumOut").value;
	var grade =  parseInt(document.getElementById("mySelect").value)
    //alert ("hello")
	// create filters object
	var filters={
		'name':personalNum,
		'course':courNum,
		'grade':grade
	}
	// Call function to display output
	getSoldierData(filters);

}
//========================================================================================
window.addEventListener("DOMContentLoaded", function(e) {

    var stage = document.getElementById("stage");
    var fadeComplete = function(e) { stage.appendChild(arr[0]); };
    var arr = stage.getElementsByTagName("a");
    for(var i=0; i < arr.length; i++) {
        arr[i].addEventListener("animationend", fadeComplete, false);
    }

}, false);