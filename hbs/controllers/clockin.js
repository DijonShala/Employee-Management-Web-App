const main = (req, res) => {
  res.render("clockin", { title: "Clock in" });
};

const index = (req, res) => {
  res.render("index", { title: "Clock in" });
};

export default {
  main,
  index,
};
