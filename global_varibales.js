// mode e.g. square / circle / text / edit
var mode = 1;

// wether input is expected
var read = false;

// true = show grid
var grid_status = true;

// true = display lines curved
var curve_status = true;

// list of objects
var objects = [];

// list of lines
var lines = [];

// size of grid square
var griding = 20;

// prefix for input translation e.g. -alpha
var prefix = "-";

// size of text in objects
var text_size = "14px";

// radius of circle
var radius = 40;

// width of square
var square_w = 100;

// height of square
var square_h = 60;

// wether a new line has been started
var init_line = true;

// start point of a new line
var start_point = null;

// the last selected object for multiple select
var last_selected = 0;

// the object of most objects
var main_stroke_color = "black";

// the color of the grid
var grid_color = "#d0d0d0";
