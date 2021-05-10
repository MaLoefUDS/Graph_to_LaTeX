
    let grid = function() {
        c = document.getElementById('myCanvas');
        ctx = c.getContext('2d');

        ratio = c.height / c.width;

        ctx.strokeStyle = "#d0d0d0";

        for (var i = 0; i < c.height; i = i + c.height / griding) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(c.width, i)
            ctx.stroke();
        }
        for (var i = 0; i < c.width; i = i + c.height / griding) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, c.height)
            ctx.stroke();
        }
    }

    let switch_grid_status = function() { grid_status = !grid_status; draw(); };

    let regrid = function() {
        for (var i = 0; i < objects.length; i++) {
            x,y = get_closed_on_grid(objects[i].get_x(), objects[i].get_y());
            objects[i].center.set_x(x);
            objects[i].center.set_y(y);
        }
        for (var i = 0; i < lines.length; i++) {
            x,y = get_closed_on_grid(lines[i].s.get_x(), lines[i].s.get_y());
            lines[i].s.set_x(x);
            lines[i].s.set_y(y);
            for (var j = 0; j < objects.length; j++) {
                if (objects[j].in(x,y)) {
                    lines[i].s = objects[j].center;
                }
            }   
            x,y = get_closed_on_grid(lines[i].e.get_x(), lines[i].e.get_y());
            lines[i].e.set_x(x);
            lines[i].e.set_y(y);
            for (var j = 0; j < objects.length; j++) {
                if (objects[j].in(x,y)) {
                    lines[i].e = objects[j].center;
                }
            }   
        }
    }

    let get_closed_on_grid = function(c_x, c_y) {

        c = document.getElementById('myCanvas');
        step_size = c.height / griding;

        x = c_x;
        y = c_y;
                
        for (var pix = 0; pix < c.width; pix += step_size) {
            if (Math.abs(c_x - pix) < step_size / 2) {
                x = pix;
                if (Math.abs(c_x - (pix + step_size)) < Math.abs(c_x - pix)) {
                    x = pix + step_size;
                }
            }
        }

        for (var pix = 0; pix < c.height; pix += step_size) {
            if (Math.abs(c_y - pix) < step_size / 2) {
                y = pix;
                if (Math.abs(c_y - (pix + step_size)) < Math.abs(c_y - pix)) {
                    y = pix + step_size;
                }
            }
        }

        return (x,y);
    }

