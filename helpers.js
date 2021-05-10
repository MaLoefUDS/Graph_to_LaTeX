/**
 * replace words with ASCII representations for LaTeX
 * @param {String} input 
 * @returns the string with substitutions
 */
let translation_table = function (input) {
    input = input.replace(prefix + "alpha", "\u03B1");
    input = input.replace(prefix + "beta", "\u03B2");
    input = input.replace(prefix + "gamma", "\u03B3");
    input = input.replace(prefix + "delta", "\u03B4");
    input = input.replace(prefix + "epsilon", "\u03B5");
    input = input.replace(prefix + "zeta", "\u03B6");
    input = input.replace(prefix + "eta", "\u03B7");
    input = input.replace(prefix + "theta", "\u03B8");
    input = input.replace(prefix + "iota", "\u03B9");
    input = input.replace(prefix + "kappa", "\u03BA");
    input = input.replace(prefix + "lambda", "\u03BB");
    input = input.replace(prefix + "mu", "\u03BC");
    input = input.replace(prefix + "nu", "\u03BD");
    input = input.replace(prefix + "xi", "\u03BE");
    input = input.replace(prefix + "omicron", "\u03BF");
    input = input.replace(prefix + "pi", "\u03C0");
    input = input.replace(prefix + "rho", "\u03C1");
    input = input.replace(prefix + "sigmaf", "\u03C2");
    input = input.replace(prefix + "sigma", "\u03C3");
    input = input.replace(prefix + "tau", "\u03C4");
    input = input.replace(prefix + "upsilon", "\u03C5");
    input = input.replace(prefix + "phi", "\u03C6");
    input = input.replace(prefix + "chi", "\u03C7");
    input = input.replace(prefix + "psi", "\u03C8");
    input = input.replace(prefix + "omega", "\u03C9");
    input = input.replace(prefix + "and", "\u2227");
    input = input.replace(prefix + "or", "\u2228");
    input = input.replace(prefix + "cdots", "\u22EF");
    input = input.replace(prefix + "check", "\u2714");
    input = input.replace(prefix + "cross", "\u2717");
    input = input.replace(prefix + "infinity", "\u221E");
    input = input.replace(prefix + "rightarrow", "\u2192");
    input = input.replace(prefix + "leftarrow", "\u2190");
    input = input.replace(prefix + "leftrightarrow", "\u2194");
    input = input.replace(prefix + "Rightarrow", "\u21D2");
    input = input.replace(prefix + "Leftarrow", "\u21D0");
    input = input.replace(prefix + "Leftrightarrow", "\u21D4");
    input = input.replace(prefix + "forall", "\u2200");
    input = input.replace(prefix + "exits", "\u2203");
    input = input.replace(prefix + "in", "\u2208");
    input = input.replace(prefix + "notin", "\u2209");
    input = input.replace(prefix + "cdot", "\u22C5");
    return input;
}

/**
 * safe currect graph to file
 */
let safe = function() {
    let dict = {
        obj: objects,
        lns: lines
    }
    download(JSON.stringify(dict, null, 2), "GtL");
}

/**
 * load graph from file
 */
let load_from_json = function() {
    
    // get file handle from html 
    const input = document.querySelector('input[type="file"]');
    const file = input.files[0];
    
    // open a reader to see the files content
    let reader = new FileReader();
    reader.readAsText(file);

    reader.onload = function() {
        
        // parse read json
        content = JSON.parse(reader.result);

        // seperate in objects and lines again
        lns = content['lns'];
        obj = content['obj'];

        // for all objects in file: parse
        obj.map(elem => {
            objects.push(parse_object(elem));
        });

        // for all lines in file: parse + attach end points to objects
        lns.map(elem => {
            line = parse_line(elem);
            for (var i = 0; i < objects.length; i++) {
                if (objects[i].in(line.s.x, line.s.y)) {
                    line.s = objects[i].center;
                }
                if (objects[i].in(line.e.x, line.e.y)) {
                    line.e = objects[i].center;
                }
            }
            lines.push(line);
        });

        // if grid is activated, snap objects to grid
        if (grid_status) {
            regrid();
        }

        draw();
    };
}

/**
 * parse a dot from json to object
 * @param {String} input 
 * @returns the parsed dot
 */
let parse_dot = function(input) {
    return new Dot(input["x"], input["y"]);
}

/**
 * parse a line from json to object
 * @param {String} input 
 * @returns the parsed line
 */
let parse_line = function(input) {
    s = parse_dot(input["s"]);
    e = parse_dot(input["e"]);
    line = new Line(s, e);
    line.selected = input["selected"];
    line.moveable = input["moveable"];
    line.content = input["content"];
    return line;
}

/**
 * parse a object from json to object
 * @param {String} input 
 * @returns the parsed object
 */
let parse_object = function(input) {
    type = input["type"];
    content = input["content"];
    center = parse_dot(input["center"]);
    o = null;
    
    if (type == "circle") {
        o = new Circle(center, content);
    } else if (type == "square") {
        text = input["text"];
        o = new Square(center, content, text);
    }
    
    o.selected = input["selected"];
    o.moveable = input["moveable"];
    console.log(o);
    
    return o;
}

/**
 * download content to file
 * @param {String} data the content to download
 * @param {String} filename the name of the output file
 * @param {Optional} type the type of the output blob
 */
let download = function(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(file, filename);
    } else {
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

/**
 * setting the mode the system is in
 * @param {Number} param the mode to set
 */
let set_mode = function(param) {
    mode = param;
    config();
}

/**
 * invert curve status and redraw the canvas
 */
let switch_curve_status = function() { 
    curve_status = !curve_status;
    draw(); 
};

/**
 * setting the "selected" menu text depending on the mode
 */
let config = function() {
    var display = document.getElementById('selection');

    // set color
    switch(mode) {
        case 4: display.style.color = "red"; break;
        default: display.style.color = main_stroke_color; break;
    }

    // set content
    switch(mode) {
        case 1: display.innerHTML = "Circle Selected"; break;
        case 2: display.innerHTML = "Square Selected"; break;
        case 3: display.innerHTML = "Line Selected"; break;
        case 4: display.innerHTML = "Edit Mode"; break;
        case 5: display.innerHTML = "Text Selected"; break;
        default: throw new Error("System in invalid mode");
    }
}

/**
 * close the input field used for changing node's content
 */
let close_edit = function() {
    document.getElementById('preview').value = "";
    document.getElementById('preview').placeholder = "Preview";
    document.getElementById('preview').disabled = true;
    document.getElementById('preview').hidden = true;
}

/**
 * rename selected nodes to value in input field and redraw
 */
let rename_node = function() {
    con = translation_table(document.getElementById('preview').value);        
    for (var i = 0; i < objects.length; i++) {
        if (objects[i].selected) {
            objects[i].content = con;
            objects[i].deselect();
        }
    }
    close_edit();
    draw();
}

/**
 * selects or deselects objects depending on a given point
 * @param {onmousedown} event the mouse click event
 */
let check_approx = function(event) {

    x = event.clientX;
    y = event.clientY;

    for (var i = 0; i < objects.length; i++) {

        // if object is hit by the click
        if (objects[i].in(x, y)) {

            // if object is hit and not selects yet ...
            if (!objects[i].selected) {

                // now waiting for user input (to rename the node)
                read = true;

                // display node's current content as a placeholder in the input field
                document.getElementById('preview').placeholder = objects[i].get_content();

                // select the object
                objects[i].select();

                // make the object the last most selected object
                last_selected = i;
            } else {

                // if object is hit but selected already but not moveable yet ...
                if (!objects[i].moveable) {

                    // make the object moveable 
                    objects[i].moveable = true;

                    // not waiting for input anymore
                    read = false;
                    close_edit();
                } else {
                    // if object is already moveable

                    // deselect object 
                    objects[i].deselect();

                    // display node's current content as a placeholder in the input field
                    document.getElementById('preview').placeholder = objects[i].get_content();
                }  
            }
        } else {

            // if object is missed AND shift key is not pressed deselect object
            // (if shift is pressed keep the object selected to make multiple select possible)
            if (!event.shiftKey) {
                objects[i].deselect();
                objects[i].moveable = false;
            }
        }
    }
}

/**
 * on window size update rescale the canvas object acording, snap objects on grid again
 * and redraw 
 */
let rescale_canvas = function() {

    // aquiring body format
    x = document.body.clientWidth;
    y = document.body.clientHeight;

    // set canvas format accordingely
    c = document.getElementById('myCanvas');
    c.width = x;
    c.height = y / 1.3;

    // set canvas margins
    document.body.style.marginLeft = 0;
    document.body.style.marginRight = 0;
    document.body.style.marginTop = 0;

    if (grid_status) {
        regrid();
    }
    draw();
}

/**
 * clearing up the canvas (used before every draw)
 * @param {Boolean} clear_objects wether to also permanently remove all objects
 */
let clear_canvas = function(clear_objects) {

    // get canvas and fill it with uniform color
    c = document.getElementById('myCanvas');
    ctx = c.getContext('2d');
    ctx.fillStyle = "#e0e0e0";
    ctx.fillRect(0, 0, c.width, c.height);
    
    if (grid_status) {
        grid();
    }
    
    if (clear_objects) {
        objects = [];
        lines = [];
    }
}

/**
 * rescaling the canvas, including grid and objects and redraw
 * @param {String} operator wether to scale up or down
 */
function scale(operator) {
    if (operator == "+") {
        griding  -= 5;
        radius   += 5;
        square_h += 5;
        square_w += 10;
    } else {
        griding  += 5;
        radius   -= 5;
        square_h -= 5;
        square_w -= 10;
    }
    if (grid_status) {
        regrid();
    }
    draw();
}