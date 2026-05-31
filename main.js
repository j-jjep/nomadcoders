const loginBtn = document.getElementById("login-btn");
const nameInput = document.getElementById("nameInput");
const greeting = document.getElementById("greeting");

const clock = document.getElementById("clock");
const dateText = document.getElementById("date");

const todoInput = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");

let isLogin = false;

const savedUser = localStorage.getItem("username");

if(savedUser){

    greeting.textContent = `Welcome, ${savedUser}`;

    nameInput.style.display = "none";

    loginBtn.textContent = "로그아웃";

    isLogin = true;
}

loginBtn.addEventListener("click",()=>{

    if(!isLogin){

        const username = nameInput.value.trim();

        if(username === ""){

            alert("이름을 입력해주세요.");
            return;
        }

        localStorage.setItem(
            "username",
            username
        );

        greeting.textContent =
            `Welcome, ${username}`;

        nameInput.style.display = "none";

        loginBtn.textContent =
            "로그아웃";

        isLogin = true;

    }else{

        localStorage.removeItem(
            "username"
        );

        greeting.textContent =
            "Welcome";

        nameInput.style.display =
            "block";

        nameInput.value = "";

        loginBtn.textContent =
            "로그인";

        isLogin = false;
    }
});

function updateClock(){

    const now = new Date();

    const hour =
        String(now.getHours())
        .padStart(2,"0");

    const minute =
        String(now.getMinutes())
        .padStart(2,"0");

    const second =
        String(now.getSeconds())
        .padStart(2,"0");

    clock.textContent =
        `${hour}:${minute}:${second}`;

    const options = {

        year:"numeric",
        month:"long",
        day:"numeric",
        weekday:"long"
    };

    dateText.textContent =
        now.toLocaleDateString(
            "ko-KR",
            options
        );
}

updateClock();

setInterval(
    updateClock,
    1000
);

function createCalendar(){

    const calendar =
        document.getElementById("calendar");

    const yearText =
        document.getElementById("calendar-year");

    const monthText =
        document.getElementById("calendar-month");

    const now = new Date();

    const year = now.getFullYear();
    const month = now.getMonth();

    const today = now.getDate();

    yearText.textContent = year;
    monthText.textContent = `${month + 1}월`;

    const firstDay =
        new Date(year, month, 1).getDay();

    const lastDate =
        new Date(year, month + 1, 0).getDate();

    let html = `
        <table class="calendar-table">
            <thead>
                <tr>
                    <th>일</th>
                    <th>월</th>
                    <th>화</th>
                    <th>수</th>
                    <th>목</th>
                    <th>금</th>
                    <th>토</th>
                </tr>
            </thead>
            <tbody>
                <tr>
    `;

    for(let i=0;i<firstDay;i++){

        html += `<td class="empty"></td>`;
    }

    for(let day=1;day<=lastDate;day++){

        const isToday =
            day === today
            ? "today"
            : "";

        html += `
            <td class="${isToday}">
                ${day}
            </td>
        `;

        if((firstDay + day) % 7 === 0){

            html += `
                </tr>
                <tr>
            `;
        }
    }

    html += `
            </tr>
            </tbody>
        </table>
    `;

    calendar.innerHTML = html;
}

createCalendar();

const API_KEY = "0103ce69ac305e6d2112e3d2395ded9b";

function getWeather(
    lat,
    lon
){

    fetch(
`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=kr`
    )
    .then(res=>res.json())
    .then(data=>{

        document.getElementById(
            "city"
        ).textContent =
            data.name;

        document.getElementById(
            "temp"
        ).textContent =
            `${Math.round(
                data.main.temp
            )}°C`;

        document.getElementById(
            "weather-desc"
        ).textContent =
            data.weather[0]
            .description;

        document.getElementById(
            "humidity"
        ).textContent =
            `습도 ${data.main.humidity}%`;

        document.getElementById(
            "wind"
        ).textContent =
            `풍속 ${data.wind.speed}m/s`;

        const iconCode =
            data.weather[0]
            .icon;

        document.getElementById(
            "weather-icon"
        ).src =`weather/${iconCode}.png`;

    })
    .catch(()=>{

        document.getElementById(
            "weather-desc"
        ).textContent =
            "날씨 정보를 불러올 수 없습니다.";
    });
}

if(
    navigator.geolocation
){

    navigator.geolocation
    .getCurrentPosition(

        position=>{

            getWeather(

                position.coords
                .latitude,

                position.coords
                .longitude
            );
        },

        ()=>{

            document.getElementById(
                "city"
            ).textContent =
                "위치 정보 없음";

            document.getElementById(
                "weather-desc"
            ).textContent =
                "위치 정보를 허용해주세요.";
        }
    );

}else{

    document.getElementById(
        "weather-desc"
    ).textContent =
        "위치 서비스를 지원하지 않습니다.";
}

let todos =
JSON.parse(
    localStorage.getItem(
        "todos"
    )
) || [];

function saveTodos(){

    localStorage.setItem(

        "todos",

        JSON.stringify(
            todos
        )
    );
}

function renderTodo(){

    todoList.innerHTML = "";

    todos.forEach(
        (todo,index)=>{

        const li =
            document.createElement(
                "li"
            );

        const checkbox =
            document.createElement(
                "input"
            );

        checkbox.type =
            "checkbox";

        checkbox.checked =
            todo.completed;

        const span =
            document.createElement(
                "span"
            );

        span.textContent =
            todo.text;

        if(
            todo.completed
        ){

            span.style
            .textDecoration =
            "line-through";

            span.style
            .opacity =
            "0.5";
        }

        checkbox
        .addEventListener(
            "change",
            ()=>{

            todo.completed =
                checkbox.checked;

            saveTodos();

            renderTodo();
        });

        const deleteBtn =
            document.createElement(
                "button"
            );

        deleteBtn.textContent =
            "-";

        deleteBtn
        .addEventListener(
            "click",
            ()=>{

            todos.splice(
                index,
                1
            );

            saveTodos();

            renderTodo();
        });

        li.appendChild(
            checkbox
        );

        li.appendChild(
            span
        );

        li.appendChild(
            deleteBtn
        );

        todoList
        .appendChild(
            li
        );
    });
}

renderTodo();

addBtn
.addEventListener(
    "click",
    ()=>{

    const text =
        todoInput.value
        .trim();

    if(
        text === ""
    ) return;

    todos.push({

        text:text,

        completed:false
    });

    saveTodos();

    renderTodo();

    todoInput.value =
        "";
});

document
.getElementById(
    "todo-form"
)
.addEventListener(
    "submit",
    e=>{

    e.preventDefault();

    addBtn.click();
});

const backgrounds = [
    {
        bg:"img/bg_1.png",
        fg:"img/fg_1.png"
    },
    {
        bg:"img/bg_2.png",
        fg:"img/fg_2.png"
    },
    {
        bg:"img/bg_3.png",
        fg:"img/fg_3.png"
    }
];

const selected =
    backgrounds[
        Math.floor(
            Math.random() *
            backgrounds.length
        )
    ];

document.getElementById(
    "background"
).src =
    selected.bg;

document.getElementById(
    "foreground"
).src =
    selected.fg;