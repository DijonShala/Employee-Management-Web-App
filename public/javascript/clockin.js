let clocked_in = false;
let clocked_in_time = 0;

let clock_in_time = 33300000;
let clock_out_time = 36300000;

const months_strings = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const weekdays_strings = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function format_0(n) {
  if (n < 10) {
    return "0" + n;
  }
  return n;
}

function slice_time(t) {
  t = Math.floor(t / 1000);

  seconds = t % 60;

  t = Math.floor(t / 60);

  minutes = t % 60;

  t = Math.floor(t / 60);

  hours = t;

  return { seconds, minutes, hours };
}

function set_time() {
  const date = new Date();

  let string_date =
    weekdays_strings[date.getDay()] +
    ", " +
    date.getDate() +
    " " +
    months_strings[date.getMonth()] +
    " " +
    date.getFullYear();
  document.getElementById("time-1").innerHTML = string_date;

  let string_unit = "";
  let string_hours = "";
  let string_seconds = "";

  if (!clocked_in) {
    string_unit = date.getHours() < 12 ? "AM" : "PM";
    string_hours = (date.getHours() % 12) + ":" + format_0(date.getMinutes());
    string_seconds = ":" + format_0(date.getSeconds());
  } else {
    string_unit = "HRS";

    clocked_time = slice_time(date.getTime() - clocked_in_time);
    string_seconds = ":" + format_0(clocked_time.seconds);
    string_hours = clocked_time.hours + ":" + format_0(clocked_time.minutes);
  }

  document.getElementById("time-2-1").innerHTML = string_hours;
  document.getElementById("time-2-2").innerHTML = string_seconds;
  document.getElementById("time-2-3").innerHTML = string_unit;

  let current_time = date.getTime() % 86400000;

  if (current_time < clock_out_time && current_time > clock_in_time) {
    document.getElementById("ontime").innerHTML = "Work hours";
    document.getElementById("ontime").classList.remove("text-secondary");
    document.getElementById("ontime").classList.add("text-success");
  } else {
    document.getElementById("ontime").innerHTML = "Free time";
    document.getElementById("ontime").classList.remove("text-success");
    document.getElementById("ontime").classList.add("text-secondary");
  }
}

function manage_clocking() {
  let hidden_class_string = "clocked-out";
  let shown_class_string = "clocked-in";
  if (clocked_in) {
    hidden_class_string = "clocked-in";
    shown_class_string = "clocked-out";

    let clocked = new Date(clocked_in_time);

    document.getElementById("clockedtime").innerHTML =
      clocked.getHours() + ":" + format_0(clocked.getMinutes());
  }

  let hidden_elements = document.getElementsByClassName(hidden_class_string);
  let shown_elements = document.getElementsByClassName(shown_class_string);

  for (let el of hidden_elements) {
    el.style.display = "";
  }

  for (let el of shown_elements) {
    el.style.display = "none";
  }

  set_time();
}

function clock_in() {
  if (clocked_in) {
    return;
  }
  clocked_in = true;

  const d = new Date();
  clocked_in_time = d.getTime();

  manage_clocking();
}

function clock_out() {
  if (!clocked_in) {
    return;
  }
  clocked_in = false;
  manage_clocking();

  // Toast to worker
  const date = new Date();

  clocked_time = slice_time(date.getTime() - clocked_in_time);
  string_seconds = ":" + format_0(clocked_time.seconds);
  string_hours = clocked_time.hours + ":" + format_0(clocked_time.minutes);

  document.getElementById("time-t-1").innerHTML = string_hours;
  document.getElementById("time-t-2").innerHTML = string_seconds;

  var toastElList = [].slice.call(document.querySelectorAll(".toast"));
  var toastList = toastElList.map(function (toastEl) {
    return new bootstrap.Toast(toastEl);
  });
  toastList.forEach((toast) => toast.show());
}

function set_clockin_time() {
  document.getElementById("clock-in-time").innerHTML =
    slice_time(clock_in_time).hours +
    ":" +
    format_0(slice_time(clock_in_time).minutes);

  document.getElementById("clock-out-time").innerHTML =
    slice_time(clock_out_time).hours +
    ":" +
    format_0(slice_time(clock_out_time).minutes);
}

function start_time() {
  manage_clocking();

  set_time();
  var intervalId = window.setInterval(function () {
    set_time();
  }, 1000);
}
