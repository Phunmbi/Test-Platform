var title = document.getElementById("title");
var main = document.getElementById("main");
var username = document.getElementById("username");
var identificationNo = document.getElementById("identificationNumber");
var submit = document.getElementById("submit");
var dropdown = document.getElementById("dropdown");
var options = document.getElementById("options");
var buttons = document.getElementById("pagination");

username.focus();

function storeUserInfo() {
    if (typeof (Storage) !== "undefined") {
        sessionStorage.setItem("username", username.value);
        sessionStorage.setItem("matricNo", identificationNo.value);
        sessionStorage.setItem("subject", dropdown.value)
    } else {
        console.log("Sorry we won't be able to collate your results because your browser won't let us.");
    }
}

function clearDom() {
    title.innerHTML = "";
    main.innerHTML = "";
    options.innerHTML = "";
}

function createQuestion(track, score) {
    var getQuestion = new XMLHttpRequest();
    getQuestion.overrideMimeType("application/json");
    getQuestion.open("GET", "file:///C:/wamp64/www/TestApp/js/testQuestions.json", true);
    getQuestion.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            data = JSON.parse(getQuestion.responseText);
            response(data, track, score);
        }
    }
    getQuestion.send();
};

submit.addEventListener("click", function (event) {
    event.preventDefault();
    storeUserInfo();
    clearDom();
    createQuestion(0);
    createNextButton();
})

function response(result, track, score) {
    var listQuestions = [];
    for (var subject in result) {
        var questions = result[subject];
        if (dropdown.value == subject) {
            title.innerHTML = "Welcome to the " + subject + " Test Questions";
            for (var numbers in questions) {
                if (questions.hasOwnProperty(numbers)) {
                    listQuestions.push(questions[numbers])
                };
            }
            storeAnswer(listQuestions, track, score);
            setQuestion(listQuestions, track);
        }
    }
}

function setQuestion(listQuestions, track) {
    if (listQuestions.length !== track) {
        main.innerHTML = listQuestions[track].question;
        for (var option in listQuestions[track].options) {
            var eachOption = listQuestions[track].options[option];
            createOptions(eachOption);
        }
    } else {
        setResults();
    }
}

function setResults() {
    buttons.innerHTML = "";
    var storedUser = sessionStorage.getItem("username");
    var storedMatric = sessionStorage.getItem("matricNo");
    var storedSubject = sessionStorage.getItem("subject");
    var question1 = parseInt(sessionStorage.getItem("question0"));
    var question2 = parseInt(sessionStorage.getItem("question1"));
    var question3 = parseInt(sessionStorage.getItem("question2"));
    var question4 = parseInt(sessionStorage.getItem("question3"));
    var question5 = parseInt(sessionStorage.getItem("question4"));
    var finalResult = question1 + question2 + question3 + question4 + question5
    title.innerHTML = "Hello " + storedUser + ", with Identification Number " + storedMatric + ". In your " + storedSubject + " test, you scored " + finalResult + " of 5";
    reset();
}


function createOptions(optionLetter) {
    var parentDiv = document.createElement("div");
    var option = document.createElement("label");
    var radio = document.createElement("input");
    radio.type = "radio";
    option.innerHTML = optionLetter;
    parentDiv.appendChild(radio);
    parentDiv.appendChild(option);
    options.appendChild(parentDiv);
}

function createNextButton(result) {
    var track = 0;
    var score = "";
    var btn = document.createElement("button");
    btn.innerHTML = "Next";
    buttons.appendChild(btn);
    btn.addEventListener("click", function (event) {
        for (var answer in options.children) {
            if (options.children.hasOwnProperty(answer)) {
                if (options.children[answer].children[0].checked == true) {
                    score = options.children[answer].children[1].textContent;
                }
            }
        }
        clearDom();
        track++;
        createQuestion(track, score);
    })
}

function storeAnswer(listQuestions, tracks, score) {
    if (tracks > 0) {
        tracks--
        if (score == listQuestions[tracks].correctAnswer) {
            sessionStorage.setItem("question" + tracks, 1)
        } else {
            sessionStorage.setItem("question" + tracks, 0)
        }
    }
}

function reset() {
    var btn = document.createElement("button");
    btn.innerHTML = "Reset";
    buttons.appendChild(btn);

    btn.addEventListener("click", function (event) {
        window.location.reload();
    })
}