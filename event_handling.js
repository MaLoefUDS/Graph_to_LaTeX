/**
 * handling mouse movement
 * @param {onmousemove} event the mouse movement event
 */
onmousemove = function(event){

    // update mouse position element
    document.getElementById('mouse').innerHTML = event.clientX + ", " + event.clientY;
    
    // create potential new selection
    selection = new Selection();

    // if in edit mode
    if (mode == 4) {

        if (last_selected != null) {
            // add selected elements to selection but last selected element last so that the 
            // holdpoint is on the last selected object
            for (var i = 0; i < objects.length; i++) {
                if (objects[i].selected && i != last_selected) {
                    selection.add(i, objects[i]);
                }
            }
            selection.add(last_selected, objects[last_selected]);
        }

        // if at max 1 object is selected and shift key is released ... 
        if (!selection.valid()) {
            if (!event.shiftKey) {                
                
                //  track the selected element to the mouse ... 
                for (var i = 0; i < objects.length; i++) {
                    if (objects[i].moveable) {

                        // is grid is activated, snap to grid
                        if (grid_status) {
                            x,y = get_closest_grid_point(event.clientX, event.clientY);                                
                            objects[i].set_x(x);
                            objects[i].set_y(y);
                        } else {
                            objects[i].set_x(event.clientX);
                            objects[i].set_y(event.clientY);
                        }
                        draw();
                    }
                }
            }
        } else {

            // if multiple elements have been selected and shift key is released ...
            if (!event.shiftKey) {

                // hide input field
                close_edit();

                // track elements on mouse
                for (var i = 0; i < selection.elements.length; i++) {
                    element = selection.elements[i];

                    // get current position of element in corralation to the holding point
                    // of the selection
                    x_sel = event.clientX + element[1][1];
                    y_sel = event.clientY + element[1][2];

                    // is grid is activated, snap to grid
                    if (grid_status) {
                        x,y = get_closest_grid_point(x_sel, y_sel);
                        objects[element[0]].set_x(x);
                        objects[element[0]].set_y(y);
                    } else {
                        objects[element[0]].set_x(x_sel);
                        objects[element[0]].set_y(y_sel);
                    }
                }
                draw();
            }
        }
    } 

    // if line mode is selected and starting point has been set already
    if (mode == 3 && !init_line) {

        // add line temporarely, draw and remove line again
        lines.push(new Line(start_point, new Dot(event.clientX, event.clientY)));
        draw();
        lines.splice(lines.length - 1, 1);
    }
}

/**
 * handling mouse click event
 * @param {onmousedown} event the mouse click
 */
document.getElementById('myCanvas').onmousedown = function(event){

    x = event.clientX;
    y = event.clientY;
    
    // if grid is active snap clicked point to grid
    if (grid_status) {
        x,y = get_closest_grid_point(x, y);
    }

    // create object depending on selected mode
    if (mode == 1) {
        objects.push(new Circle(new Dot(x, y), objects.length));
    } else if (mode == 2) {
        objects.push(new Square(new Dot(x, y), objects.length, false));
    } else if (mode == 5) {
        objects.push(new Square(new Dot(x, y), objects.length, true));
    } else if (mode == 3) {
        // for creating a line ...

        // if line has not yet started
        if (init_line) {
            start_point = new Dot(x, y);

            // if clicked point hits object attach line to object
            for (var i = 0; i < objects.length; i++) {
                if (objects[i].in(x, y)) {
                    start_point = objects[i].center;
                    break;
                }
            } 

            // line has started now
            init_line = false;
        } else {
            end_point = new Dot(x, y);
            connection = null;

            // attach end point to object if possible
            for (var i = 0; i < objects.length; i++) {
                if (objects[i].in(x, y)) {
                    end_point = objects[i].center;
                    connection = objects[i];
                    break;
                }
            }

            // if start point is different from end point add line
            if (start_point.x != end_point.x || start_point.y != end_point.y) {
                line = new Line(start_point, end_point);
                line.connection = connection;
                lines.push(line);
            }

            // line has ended now
            start_point = null;
            init_line = true;
        }
    } else {

        // if edit mode, check if object is hit
        check_approx(event);
    }
    draw();
}

/**
 * handling keyboard input
 * @param {onkeydown} event the keyboard input event 
 */
document.onkeydown = function(event) {

    // if in edit mode and no input expected (aka. moving a node)
    if (mode == 4 && !read) {

        // if backspace is pressed
        if (event.key == "Backspace") {

            // remove selected objects and lines attached
            for (var i = 0; i < objects.length; i++) {
                if (objects[i].selected) {
                    
                    // remove object
                    objects.splice(i, 1);
                    last_selected = null;

                    // search attached lines and remove too
                    for (var j = 0; j < lines.length; j++) {
                        if (lines[j].e == objects[i].center || lines[j].s == objects[i].center) {
                            lines.splice(j, 1);        
                        }
                    }
                    draw();
                }
            }
        }
    } else if (mode == 4 && read) {
        // if in edit mode and user input is expected, activate input field

        // activate field
        document.getElementById('preview').disabled = false;
        document.getElementById('preview').hidden = false;
        document.getElementById('preview').focus();

        // on enter rename nodes
        if (event.key == "Enter") {
            rename_node();
        }
    }
    if (mode == 3) {

        // if escape while drawing lines, stop
        if (!init_line) {
            if (event.key == "Escape") {
                init_line = true;
                start_point = null;
                draw();
            }
        }
    }
};