
    /**
     * function to draw the grid on the canvas
     */
    let grid = function() {

        // load canvas
        c = document.getElementById('myCanvas');
        ctx = c.getContext('2d');

        // set line color to lightgray
        ctx.strokeStyle = "#d0d0d0";

        // draw horizontal lines
        for (var i = 0; i < c.height; i += c.height / griding) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(c.width, i)
            ctx.stroke();            
        }
        // draw vertical lines
        for (var i = 0; i < c.width; i = i + c.height / griding) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, c.height)
            ctx.stroke();
        }
    }

    /**
     * invert grid status and redraw the canvas
     */
    let switch_grid_status = function() { 
        grid_status = !grid_status; 
        if (grid_status) {
            regrid();
        }
        draw(); 
    };

    /**
     * snap every object back on grid after rescaling the window or loading from files
     */
    let regrid = function() {

        // for all objects: put object on grid
        for (var i = 0; i < objects.length; i++) {
            x,y = get_closest_grid_point(objects[i].get_x(), objects[i].get_y());
            objects[i].set_x(x);
            objects[i].set_y(y);
        }

        // for all lines: put endpoints on grid
        for (var i = 0; i < lines.length; i++) {

            // start point
            x,y = get_closest_grid_point(lines[i].s.get_x(), lines[i].s.get_y());
            lines[i].s.set_x(x);
            lines[i].s.set_y(y);

            // end point
            x,y = get_closest_grid_point(lines[i].e.get_x(), lines[i].e.get_y());
            lines[i].e.set_x(x);
            lines[i].e.set_y(y);
        }
    }

    /**
     * get closed grid point for given coordinates
     * @param {Number} c_x the x coordinate
     * @param {Number} c_y the y coordinate
     * @returns coordinates on grid
     */
    let get_closest_grid_point = function(c_x, c_y) {

        // get canvas and calcuate the grid
        c = document.getElementById('myCanvas');
        step_size = c.height / griding;

        // dublicate coordinates to preserve old and new version
        x = c_x;
        y = c_y;
                
        // iterate of width of canvas and get grid point closest to c_x
        for (var pix = 0; pix < c.width; pix += step_size) {
            if (Math.abs(c_x - pix) < step_size / 2) {
                x = pix;
                if (Math.abs(c_x - (pix + step_size)) < Math.abs(c_x - pix)) {
                    x = pix + step_size;
                }
            }
        }

        // iterate of height of canvas and get grid point closest to c_y
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

