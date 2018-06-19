// Host of Neo4j installation
const NEO4J_HOST = 'bolt://localhost:7687';

// Credentails of  Neo4j
const NEO4J_USERNAME="neo4j"
const NEO4J_PASSWORD="neo4j1"

// Create a driver to connect to the Neo4j database
const driver = neo4j.v1.driver(NEO4J_HOST, neo4j.v1.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD));
// Create a session to execute the query.
const session = driver.session();


// a function to get all test soldiers count
function getSoldiersCount(){
	var query = 'MATCH (sold:TestSoldier) return count(sold) as count';
	session.run(query).then( function (result) {
		// Iterate over all the records
		result.records.forEach(function (record) {

			//  Change the SoldierCount on UI
			$("#SoldierCount").html('מספר החיילים: '+record.get('count').low).css('direction','rtl');

		});
	}).catch(function (error) {
		console.log(error);
	});
}

//a function to get all input soldiers count
function OpGetSoldiersCount(){
	var query = 'MATCH (sold:Soldier) return count(sold) as count';
	session.run(query).then( function (result) {
		// Iterate over all the records
		result.records.forEach(function (record) {

			//  Change the SoldierCount on UI
			$("#OpSoldierCount").html('מספר החיילים: '+record.get('count').low).css('direction','rtl');

		});
	}).catch(function (error) {
		console.log(error);
	});
}

// a function to get all test course count
function getCourseCount(){
	var query = 'MATCH (course:TestCourse) return count(course) as count';
	session.run(query).then( function (result) {
		// Iterate over all the records
		result.records.forEach(function (record) {

			//  Change the CourseCount on UI
			$("#CourseCount").html('<span>מספר הקורסים: </span> <span>'+record.get('count').low+'</span>').css('direction','rtl');
		
		});

	}).catch(function (error) {
		console.log(error);
	});
}

//a function to get all input course count
function OpGetCourseCount(){
	var query = 'MATCH (course:Course) return count(course) as count';
	session.run(query).then( function (result) {
		// Iterate over all the records
		result.records.forEach(function (record) {

			//  Change the CourseCount on UI
			$("#OpCourseCount").html('<span>מספר הקורסים: </span> <span>'+record.get('count').low+'</span>').css('direction','rtl');
		
		});
	}).catch(function (error) {
		console.log(error);
	});
}

// A function to get all test courses
function getAllCourses(){
	var query = 'MATCH (course:TestCourse) return course.id as course_id ORDER BY course_id';
	session.run(query).then( function (result) {

		// Empty previous table
		$("#courseList").html('');
		$("#courseList").append('<a href="#" class="list-group-item list-group-item-success">מספר קורס</a>');

		// Iterate over all the records
		result.records.forEach(function (record) {
			//console.log('Course Id:',record.get('course_id'));
			$("#courseList").append('  <a class="list-group-item list-group-item-info">'+record.get('course_id')+'</a>');
		});

	}).catch(function (error) {
		console.log(error);
	});
}

//A function to get all input courses
function OpGetAllCourses(){
	var query = 'MATCH (course:Course) return course.id as course_id ORDER BY course_id';
	session.run(query).then( function (result) {

		// Empty previous table
		$("#OpCourseList").html('');
		$("#OpCourseList").append('<a href="#" class="list-group-item list-group-item-success">מספר קורס</a>');

		// Iterate over all the records
		result.records.forEach(function (record) {
			//console.log('Course Id:',record.get('course_id'));
			$("#OpCourseList").append('  <a class="list-group-item list-group-item-info">'+record.get('course_id')+'</a>');
		});

	}).catch(function (error) {
		console.log(error);
	});
}

// A function to get all test soldiers
function getAllSoldiers(){
	var query = 'MATCH (soldier:TestSoldier) return toInt(soldier.id) as soldier_id ORDER BY soldier_id';
	session.run(query).then( function (result) {

		// Empty previous table
		document.getElementById("soldierList").innerHTML="";
		$("#soldierList").append('<a href="#" class="list-group-item list-group-item-success">מספר אישי</a>');

		// Iterate over all the records
		result.records.forEach(function (record) {
			//console.log('Course Id:',record.get('course_id'));
			$("#soldierList").append('  <a class="list-group-item list-group-item-info">'+record.get('soldier_id')+'</a>');
		});


	}).catch(function (error) {
		console.log(error);
	});
}

//A function to get all input soldiers
function OpGetAllSoldiers(){
	var query = 'MATCH (soldier:Soldier) return toInt(soldier.id) as soldier_id ORDER BY soldier_id';
	session.run(query).then( function (result) {

		// Empty previous table
		//document.getElementById("OpSoldierList").innerHTML="";
		$("#OpSoldierList").html('');
		$("#OpSoldierList").append('<a href="#" class="list-group-item list-group-item-success">מספר אישי</a>');

		// Iterate over all the records
		result.records.forEach(function (record) {
			//console.log('Course Id:',record.get('course_id'));
			$("#OpSoldierList").append('  <a class="list-group-item list-group-item-info">'+record.get('soldier_id')+'</a>');
		});

	}).catch(function (error) {
		console.log(error);
	});
}

// Function to add new soldier to neo4j
function addSoldier(soldier){
	// Construct a Neo4j Query to add soldier (If soldier not exists else merge the details)
	var query = 'MERGE (soldier:Soldier {id : {id} }) RETURN soldier.id AS id';

	// Run query using session
	session.run(query,soldier).then( function (result) {
		// log success message
		console.log("Success")
	}).catch(function (error) {
		console.log(error);
	});
}

//Function to add new Course to neo4j
function addCourse(course){
	// Construct a Neo4j Query to add Course (If Course not exists else merge the details)
	var query = 'MERGE (course:Course {id : {id} })';

	// Run query using session
	session.run(query,course).then( function (result) {
		// log success message
		console.log("Success")

	}).catch(function (error) {
		console.log(error);
	});

}

// Function to add grade for soldier to neo4j
function addGradeToNeo4j(grades){
	// Add grade giving soldier if not exists
	var soldier={'id':grades.gradeFrom}
	addSoldier(soldier);

	// Construct a Neo4j Query to add grades to a soldier
	var query = 'MATCH (from:Soldier),(to:Soldier),(course:Course) '
		+ 'WHERE from.id = {gradeFrom} AND to.id = {gradeTo} AND course.id = {course} '
		+ 'MERGE (grade:Grade {id:"'+ grades.gradeFrom+'_'+grades.gradeTo+'_'+grades.course+'",course:'+grades.course+'}) '
		+ 'MERGE (from)-[given:GIVEN]->(grade) '
		+ 'MERGE (to)-[received:RECEIVED]->(grade) '
		+ 'MERGE (grade)-[for:FOR]->(course) '
		+ 'MERGE (to)-[opted:OPTED]->(course) '
		+ 'SET grade.grade={grade}' ;

	// Run query using session
	session.run(query,grades).then( function (result) {


	}).catch(function (error) {
		console.log(error);
	});
}

// Function to get soldier data based on filter
function getSoldierData(filters){
	var response=[];

	// Construct a Neo4j Query to get grades of a soldier
	var query = 'MATCH (s1:Soldier{' 
	+ ((false==isNaN(filters.id))?'id:{id}':'') 
	+ '})-[:RECEIVED]->(g:Grade{'
	+ ((false==isNaN(filters.grade))?'grade:{grade}':'')
	+ ((false==isNaN(filters.grade) && false==isNaN(filters.course)) ? ',':'')
	+ ((false==isNaN(filters.course))?'course:{course}':'') +'}), '
	+ '(g)<-[:GIVEN]-(s2:Soldier) '
	+ ' return s1.id as id,s2.id as graded_by, g.grade as grade, g.course as course ORDER BY id, grade DESC';

	console.log("q:"+query);
	
	// Run query using session
	session.run(query,filters).then( function (result) {

		result.records.forEach(function (record) {
			//console.log( record.get('name'), ":", record.get('grade'),":", record.get('course') );
			var obj={};
			obj['name']=record.get('id')
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
			alert('לא קיימים נתונים עבור סינון זה');
		}

	}).catch(function (error) {
		console.log(error);
	});
}

// Function to draw output table
function drawTable(data) {
	// Define Header for table graded_by
	header={
		'name':'מספר אישי',
		'graded_by':'קיבל ציון מ',
		'course':'קורס',
		'grade':'ציון'
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
	var perNum = parseInt(document.getElementById("personalNum").value);
	var courNum = parseInt(document.getElementById("courNum").value);
	// Create soldier object
	// Call funcction to add soldier
	if("" != perNum){
		var soldier={
				'id':perNum,
			}
		addSoldier(soldier);
	}
	if(!isNaN(courNum)){
		var course={
			'id':courNum
		}
		addCourse(course);
	}
	OpUpdateStatistics();

}

function addGrade(){

    pNumbers[i] = parseInt(document.getElementById("perNum").value);
    grades[i] = parseInt(document.getElementById("grade").value);
    sum+=grades[i];
	// Soldier who is giving grade
	var from = pNumbers[i];
	// Grade
	var grade = grades[i]
    i++;

    //alert(sum);

	// Soldier to whom grade is given
	var to = parseInt(document.getElementById("personalNum").value);
	// the course for which this grade is for
	var courNum=parseInt(document.getElementById("courNum").value);

	// create grades object
	var grade={
		'gradeTo':to,
		'gradeFrom':from,
		'course':courNum,
		'grade':grade
	}
	addGradeToNeo4j(grade);
	OpUpdateStatistics();
    document.getElementById("perNum").value="";
    document.getElementById("grade").value="";

}


function outputData() {
	var personalNum = parseInt(document.getElementById("perNumOut").value);
	var courNum = parseInt(document.getElementById("courNumOut").value);
	var grade =  parseInt(document.getElementById("mySelect").value)
    //alert ("hello")
	// create filters object
	var filters={
		'id':personalNum,
		'course':courNum,
		'grade':grade
	}
	// Call function to display output
	getSoldierData(filters);

}

function getAvgScoreForSoldier(page){

	console.log(page);
	if('output'==page){
		var soldierId = document.getElementById("OpSoldierIdForAvgCourse").value;
		var html_element="OpCourseAvgForSoldier";
		var nodeLabel="";
		var relLabel="";
	}else if ('stats'==page){
		var soldierId = document.getElementById("soldierIdForAvgCourse").value;
		var html_element="courseAvgForSoldier";
		var nodeLabel="Test";
		var relLabel="TEST_";
	}
	
	// Call function to display output
	if(null == soldierId  || '' == soldierId){
		alert('אנא הכנס מספר אישי!');

	} else {
		getSoldierDataForCourses(soldierId,html_element,nodeLabel,relLabel);
	}

}

function getCourseAvgForSoldier(page){
	console.log(page);

	if('output'==page){
		var courseId = document.getElementById("OpCourseIdForAvg").value;
		var html_element="OpAvgForCourse";
		var nodeLabel="";
		var relLabel="";
	}else if ('stats'==page){
		var courseId = document.getElementById("courseIdForAvg").value;
		var html_element="avgForCourse";
		var nodeLabel="Test";
		var relLabel="TEST_";

	}

	// Call function to display output
	if('' == courseId || null == courseId){
		alert('אנא הכנס מספר קורס!');

	} else {
		getCourseDataForSoldiers(courseId,html_element,nodeLabel,relLabel);
	}
}


function updateStatistics(){

	// Get All Soldiers Count
	getCourseCount();

	// Get All Soldiers Count
	getSoldiersCount();

	// Get All Courses
	getAllCourses();

	// Get All Soldiers
	getAllSoldiers();

	// Get Overall Average Score for each Soldier
	OpGetOverallAvg("Test","TEST_","overallAvgTable");

}

function OpUpdateStatistics(){

	// Get All Soldiers Count
	OpGetCourseCount();

	// Get All Soldiers Count
	OpGetSoldiersCount();

	// Get All Courses
	OpGetAllCourses();

	// Get All Soldiers
	OpGetAllSoldiers();

	// Get Overall Average Score for each Soldier
	OpGetOverallAvg("","","OpOverallAvgTable");
	//OpGetOverallAvg();

}


function createRandomData(){
	var CourseCount = $("#courseCount").val();
	var SoldierCount = $("#soldierCount").val();
	console.log(CourseCount );
	console.log(SoldierCount );
	checkDatabase(CourseCount, SoldierCount);
}

function emptyDatabase(){

	// Cypher query to delete all the data in Neo4j
	var query="MATCH (n) OPTIONAL MATCH (n)-[r]-() DELETE n,r";

	session.run(query).then( function (result) {

		var time = result.summary.resultAvailableAfter.low + result.summary.resultConsumedAfter.low;
		alert("הנתונים נמחקו ב- "+time+" מילי-שניות");
		updateStatistics();
	}).catch(function (error) {
		console.log(error);
	});
}


//Function Call To Display Test Data Statistics at initial load
updateStatistics();

//Function Call To Display Test Data Statistics at initial load
OpUpdateStatistics();

//========================================================================================
window.addEventListener("DOMContentLoaded", function(e) {

    var stage = document.getElementById("stage");
    var fadeComplete = function(e) { stage.appendChild(arr[0]); };
    var arr = stage.getElementsByTagName("a");
    for(var i=0; i < arr.length; i++) {
        arr[i].addEventListener("animationend", fadeComplete, false);
    }

}, false);
