//Utilities is the JS for all the function that needs to be run on input data

// Function to get soldier data based on filter
function getSoldierDataForCourses(id,element_id,nodeLabel,relLabel){
	var response=[];
			
	// Construct a Neo4j Query to get grades of a soldier
	var query = 'MATCH (s:'+nodeLabel+'Soldier{id:'+id+'})-[:'+relLabel+'RECEIVED]->(g:'+nodeLabel+'Grade) RETURN g.course as course,avg(g.grade) as avg_grade';

	// Run query using session
	session.run(query).then( function (result) {
		// Close the neo4j session
		result.records.forEach(function (record) {
			var obj={};
			obj['course']=record.get('course')
			obj['avg_grade']=Math.round(record.get('avg_grade') * 100) / 100;
			response.push(obj);
            var time = result.summary.resultAvailableAfter.low + result.summary.resultConsumedAfter.low;
            alert("הנתונים נבדקו ב- "+time+" מילי-שניות");
		});

		// Empty previous table
		document.getElementById(element_id).innerHTML=""

		// Check if result has records then call to draw table function else alert no data
		if(response.length > 0){
			drawCourseAvgForSoldierTable(response,element_id);
		}else{
			// Empty the output table
			alert('לא קיימים נתונים עבור חייל זה!');
		}
		console.log("SUCCESS");

	}).catch(function (error) {
		console.log(error);
	});
}

// Function to draw output table
function drawCourseAvgForSoldierTable(data,element_id) {
	// Define Header for table graded_by
	header={
		'course':'מספר קורס',
		'avg_grade':'ציון ממוצע'
	}
	// Call a function to draw row
	drawCourseAvgForSoldierRow(header,element_id)
	for (var i = 0; i < data.length; i++) {
        drawCourseAvgForSoldierRow(data[i],element_id);
    }
	$("#"+element_id).addClass("table");

}

//Function to draw row
function drawCourseAvgForSoldierRow(rowData,element_id) {
    var row = $("<tr />")
    //this will append tr element to table... keep its reference for a while since we will add cels into it
    $("#"+element_id).append(row);
    row.append($("<td>" + rowData.course+ "</td>"));
    row.append($("<td>" + rowData.avg_grade + "</td>"));
}


// Function to get soldier data based on filter
function getCourseDataForSoldiers(id,html_element,nodeLabel,relLabel){
	var response=[];

	// Construct a Neo4j Query to get grades of a soldier
	var query = 'MATCH (s:'+nodeLabel+'Soldier)-[:'+relLabel+'RECEIVED]->(g:'+nodeLabel+'Grade{course:'+id+'}) RETURN s.id as soldier_id,avg(g.grade) as avg_grade';
	// Run query using session
	session.run(query).then( function (result) {
		// Close the neo4j session
		result.records.forEach(function (record) {
			var obj={};
			obj['soldier_id']=record.get('soldier_id')
			obj['avg_grade']=Math.round(record.get('avg_grade') * 100) / 100;
			response.push(obj);
       });
        var time = result.summary.resultAvailableAfter.low + result.summary.resultConsumedAfter.low;
        alert("הנתונים נבדקו ב- "+time+" מילי-שניות");

        // Empty previous table
		document.getElementById(html_element).innerHTML=""

		// Check if result has records then call to draw table function else alert no data
		if(response.length > 0){
			drawAvgForCourseTable(response,html_element);
		}else{
			alert('לא קיימים נתונים עבור קורס זה!');
		}

	}).catch(function (error) {
		console.log(error);
	});
}

// Function to draw output table
function drawAvgForCourseTable(data,html_element) {
	// Define Header for table graded_by
	header={
		'soldier_id':'מספר אישי',
		'avg_grade':'ציון ממוצע'
	}
	// Call a function to draw row
	drawAvgForCourseRow(header,html_element)
	for (var i = 0; i < data.length; i++) {
        drawAvgForCourseRow(data[i],html_element);
    }
	$("#"+html_element).addClass("table");

}

// Function to draw row
function drawAvgForCourseRow(rowData,html_element) {
    var row = $("<tr />")
    //this will append tr element to table... keep its reference for a while since we will add cels into it
    $("#"+html_element).append(row);
    row.append($("<td>" + rowData.soldier_id+ "</td>"));
    row.append($("<td>" + rowData.avg_grade + "</td>"));
}




//Create a function to get overall average for each soldier
function OpGetOverallAvg(nodeLabel,RelLabel,id){
	var response=[];
	var query = 'MATCH (s:'+nodeLabel+'Soldier)-[:'+RelLabel+'RECEIVED]-(g:'+nodeLabel+'Grade) return s.id as soldier_id, avg(g.grade) as avg_grade';
	session.run(query).then( function (result) {

		// Empty previous table
		$("#"+id).html('');
		console.log("With New Desing");
		// Iterate over all the records
		result.records.forEach(function (record) {
			var obj={};
			obj['soldier_id']=record.get('soldier_id');
			obj['avg_grade']=Math.round(record.get('avg_grade') * 100) / 100;
			response.push(obj);
		});

		// Check if result has records then call to draw table function else alert no data
		if(response.length > 0){
			drawAvgTable(response,id);
		}else{

			console.log('לא קיימים נתונים לפי סינון זה!');
		}

	}).catch(function (error) {
		console.log(error);
	});
}

// Function to draw output table
function drawAvgTable(data,id) {
	// Define Header for table graded_by
	header={
		'soldier_id':'מספר אישי',
		'avg_grade':'ציון ממוצע'
	}
	// Call a function to draw row
	drawAvgRow(header,id)
	for (var i = 0; i < data.length; i++) {
		drawAvgRow(data[i],id);
    }
	$("#"+id).addClass("table");

}

// Function to draw row
function drawAvgRow(rowData,id) {
    var row = $("<tr />")
    //this will append tr element to table... keep its reference for a while since we will add cels into it
    $("#"+id).append(row);
    row.append($("<td>" + rowData.soldier_id + "</td>"));
    row.append($("<td>" + rowData.avg_grade + "</td>"));
}


function checkDatabase(courseCount,soldierCount){
	var queryTime={};
	
	/***** CREATE RANDOM SOLDIERS ******/ 
	var query = 'FOREACH (r IN range(1,'+soldierCount+') | CREATE (:TestSoldier {id:r}))';

	// Run query using session
	session.run(query).then( function (result1) {
		
		// store query time required to add soldiers
		queryTime['Add Soldiers']= result1.summary.resultAvailableAfter.low + result1.summary.resultConsumedAfter.low;
		console.log('Time taken to add Soldiers: '+queryTime['Add Soldiers']);

		/***** CREATE RANDOM Courses ******/ 
		query = 'FOREACH (r IN range(1,'+courseCount+') | CREATE (:TestCourse {id:r}))';
		session.run(query).then( function (result2) {
			
			// store query time required to add courses
			queryTime['Add Courses']= result2.summary.resultAvailableAfter.low + result2.summary.resultConsumedAfter.low;
			console.log('Time taken to add Courses: '+queryTime['Add Courses']);
			
			/***** CREATE RANDOM GRADES ******/
			var gradetime = 0;
			for(var i=0; i <=soldierCount; i++ ){ 
				query = 'MATCH (c:TestCourse{id:toInt('+courseCount+'*rand())}),(s1:TestSoldier {id:'+i+'}),(s2:TestSoldier {id:toInt('+soldierCount+'*rand())})'
					+ ' WITH s1,s2,c'
					+ ' LIMIT '
					+ soldierCount
					+ ' WHERE rand() < 0.5 AND s1.id <> s2.id'
					+ ' CREATE (g:TestGrade{id:s1.id+\'_\'+s2.id+\'_\'+c.id, course:c.id, grade: 1+toInt(10*rand())})'
					+ ' MERGE (s2)-[:TEST_OPTED]->(c)'
					+ ' CREATE (g)-[:TEST_FOR]->(c)'
					+ ' CREATE (s2)-[:TEST_RECEIVED]->(g)'
					+ ' CREATE (s1)-[:TEST_GIVEN]->(g)';
				session.run(query).then( function (result3) {
					
					// store query time required to add Grades
					gradetime += (result3.summary.resultAvailableAfter.low + result3.summary.resultConsumedAfter.low);
	
				}).catch(function (error) {
					console.log(error);
				});
			}	
			queryTime['Add Grades'] = gradetime;
			console.log('Time taken to add Grades: '+queryTime['Add Grades']);
			
			// Update required time
			setTime(queryTime);
			updateStatistics();

			}).catch(function (error) {
				console.log(error);
			});
	}).catch(function (error) {
		console.log(error);
	});
	
}

function setTime(queryTime){
	var totalTime=0;
	for( var i in queryTime){
		totalTime += queryTime[i];
	}

	console.log("Total Time: "+totalTime);

	$("#performanceResult").addClass("table");
    var row = $("<tr />")
    //this will append tr element to table... keep its reference for a while since we will add cels into it
    $("#performanceResult").append(row);
    row.append($("<td> זמן כולל במילי-שניות :</td>"));
    row.append($("<td>" + totalTime + "</td>"));
}
	
