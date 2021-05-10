onmousemove = function(event){
    document.getElementById('mouse').innerHTML = event.clientX + ", " + event.clientY;
    config();
    
    selection = new Selection();

    if (mode == 4) {
        center = null;
        for (var i = 0; i < objects.length; i++) {
            if (objects[i].selected && i != last_selected) {
                selection.add(i, objects[i]);
            }
        }
        selection.add(last_selected, objects[last_selected]);
        if (!selection.valid()) {
            for (var i = 0; i < objects.length; i++) {
                type = objects[i].type;
                if (!event.shiftKey) {
                    if (objects[i].moveable) {
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
            if (!event.shiftKey) {
                close_edit();
                for (var i = 0; i < selection.elements.length; i++) {
                    element = selection.elements[i];

                    x_sel = event.clientX + element[1][1];
                    y_sel = event.clientY + element[1][2];

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
    if (mode == 3 && start_point != null) {
        lines.push(new Line(start_point, new Dot(event.clientX, event.clientY)));
        draw();
        lines.splice(lines.length - 1, 1);
    }
}

document.getElementById('myCanvas').onmousedown = function(event){

    x = event.clientX;
    y = event.clientY;
    
    if (grid_status) {
        x,y = get_closest_grid_point(event.clientX, event.clientY);
    }

    if (mode == 1) {
        objects.push(new Circle(new Dot(x, y), objects.length));
    } else if (mode == 2) {
        objects.push(new Square(new Dot(x, y), objects.length, false));
    } else if (mode == 5) {
        objects.push(new Square(new Dot(x, y), objects.length, true));
    } else if (mode == 3) {
        if (init_line) {
            start_point = new Dot(x, y);
            for (var i = 0; i < objects.length; i++) {
                if (objects[i].in(event.clientX, event.clientY)) {
                    start_point = objects[i].center;
                }
            } 
            init_line = false;
        } else {
            end_point = new Dot(x, y);
            for (var i = 0; i < objects.length; i++) {
                if (objects[i].in(event.clientX, event.clientY)) {
                    end_point = objects[i].center;
                }
            }
            if (start_point.x != end_point.x || start_point.y != end_point.y) {
                lines.push(new Line(start_point, end_point));
            }
            start_point = null;
            init_line = true;
        }
    } else {
        check_approx(event.clientX, event.clientY);
    }
    draw();
}

document.onkeydown = function (event) {
    if (mode == 4 && !read) {
        if (event.key == "Backspace") {
            for (var i = 0; i < objects.length; i++) {
                if (objects[i].selected) {
                    for (var j = 0; j < lines.length; j++) {
                        if (lines[j].e == objects[i].center || lines[j].s == objects[i].center) {
                            lines.splice(j, 1);        
                        }
                    }
                    objects.splice(i, 1);
                    draw();
                }
            }
        }
    } else if (mode == 4 && read) {
        document.getElementById('preview').focus();
        document.getElementById('preview').disabled = false;
        document.getElementById('preview').hidden = false;
        if (event.key == "Enter") {
            rename_node();
        }
    }
    if (mode == 3) {
        if (start_point != null) {
            if (event.key == "Escape") {
                init_line = true;
                start_point = null;
                draw();
            }
        }
    }
};