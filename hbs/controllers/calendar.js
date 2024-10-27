const main = (req, res) => {
  res.render("calendar", { title: "Calendar" });
};

const analytics = (req, res) => {
  res.render("index", { title: "Analytics" });
};

export default {
  main,
  analytics,
};
