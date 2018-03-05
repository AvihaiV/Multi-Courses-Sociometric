

var pNumbers= [];
var grades= [];
var sum=0;
var i=0;
var calc=0;

function inputData()
{
        var perNum =document.getElementById("personalNum").value;
        var courNum=document.getElementById("courNum").value;

}

function addGrade()
{

    pNumbers[i]=document.getElementById("perNum").value;
    grades[i]=parseInt(document.getElementById("grade").value);
    sum+=grades[i];
    i++;
    //alert(sum);


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

    alert ("hello")

}





