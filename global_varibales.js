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
var text_size = "12px";

// radius of circle
var radius = 30;

// width of square
var square_w = 80;

// height of square
var square_h = 50;

// wether a new line has been started
var init_line = true;

// start point of a new line
var start_point = null;

// the last selected object for multiple select
var last_selected = 0;

// the main object color
var main_object_color = "black";