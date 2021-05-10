/**
 * replace words with ASCII representations for LaTeX
 * @param {String} input 
 * @returns the string with substitutions
 */
let translation_table = function (input) {
    input = input.replace("\\alpha", "\u03B1");
    input = input.replace("\\beta", "\u03B2");
    input = input.replace("\\gamma", "\u03B3");
    input = input.replace("\\delta", "\u03B4");
    input = input.replace("\\epsilon", "\u03B5");
    input = input.replace("\\zeta", "\u03B6");
    input = input.replace("\\eta", "\u03B7");
    input = input.replace("\\theta", "\u03B8");
    input = input.replace("\\iota", "\u03B9");
    input = input.replace("\\kappa", "\u03BA");
    input = input.replace("\\lambda", "\u03BB");
    input = input.replace("\\mu", "\u03BC");
    input = input.replace("\\nu", "\u03BD");
    input = input.replace("\\xi", "\u03BE");
    input = input.replace("\\omicron", "\u03BF");
    input = input.replace("\\pi", "\u03C0");
    input = input.replace("\\rho", "\u03C1");
    input = input.replace("\\sigmaf", "\u03C2");
    input = input.replace("\\sigma", "\u03C3");
    input = input.replace("\\tau", "\u03C4");
    input = input.replace("\\upsilon", "\u03C5");
    input = input.replace("\\phi", "\u03C6");
    input = input.replace("\\chi", "\u03C7");
    input = input.replace("\\psi", "\u03C8");
    input = input.replace("\\omega", "\u03C9");
    input = input.replace("\\and", "\u2227");
    input = input.replace("\\or", "\u2228");
    input = input.replace("\\cdots", "\u22EF");
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