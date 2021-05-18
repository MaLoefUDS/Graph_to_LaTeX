/**
 * class that represents a dot on the 2d plane
 */
class Dot {
    constructor(x, y) {
        
        // the absolute pixel values of the dot on the plane
        this.x = x;
        this.y = y;
        
        // the relative values on the canvas
        this.x_ratio = x / document.body.clientWidth;
        this.y_ratio = y / document.body.clientHeight;
    }
    
    get_x() {
        return this.x_ratio * document.body.clientWidth;
    }
    
    get_y() {
        return this.y_ratio * document.body.clientHeight;
    }
    
    set_x(x) {
        this.x = x;
        this.x_ratio = x / document.body.clientWidth;
    }
    
    set_y(y) {
        this.y = y;
        this.y_ratio = y / document.body.clientHeight;
    }
    
}

/**
 * class that represents a line on the plane
 */
class Line {
    constructor(s, e) {

        // starting point
        this.s = s;

        // ending point
        this.e = e;

        this.connection = null;
    }

    get_color() {
        return main_stroke_color;
    }

    calculate_arrow_endpoint() {
        if (this.connection != null) {
            
            var s_vec = new simpleVector(this.s);
            var e_vec = new simpleVector(this.e);
            var v = e_vec.sub(s_vec);
            var direction_vector = v.multiply(1 / v.normalize());
            
            if (this.connection.type == "circle") {
                direction_vector = direction_vector.multiply(Circle.get_radius());
                var arr_endpoint = e_vec.sub(direction_vector);
                return arr_endpoint;
            } else if (this.connection.type == "square") {
                for (var i = 0; i < v.normalize(); i++) {                    
                    var arr_endpoint = s_vec.add(direction_vector.multiply(i));
                    if (Math.abs(arr_endpoint.x - this.e.x) < Square.get_width() / 2 && Math.abs(arr_endpoint.y - this.e.y) < Square.get_height() / 2) {
                        return arr_endpoint;
                    }
                }
            }
            return this.e;
        } else {
            return this.e;
        }
    }
}

/**
 * super class for geometric objects on the plane 
 */
class Geometrics {
    constructor(center, content, type) {

        // type identifier (e.g. "square")
        this.type = type;

        // center of the object
        this.center = center;

        // wether the object is selected
        this.selected = false;

        // wether the object has been grabbed
        this.moveable = false;
        
        // the content displayed on the object
        this.content = content;
    }

    get_x() {
        return this.center.get_x();
    }

    get_y() {
        return this.center.get_y();
    }

    set_x(x) {
        this.center.set_x(x);
    }

    set_y(y) {
        this.center.set_y(y);
    }

    select() {
        this.selected = true;
    }

    deselect() {
        this.selected = false;
        this.moveable = false;
    }

    get_content() {
        return this.content;
    }

    get_color() {
        if (this.selected) {
            return selection_color;
        } else {
            return main_stroke_color;
        }
    }

}

/**
 * class for circle object
 */
class Circle extends Geometrics {
    constructor(center, content) {
        super(center, content, "circle");
    }

    static radius = 40;

    static get_radius() {
        return Circle.radius + (document.getElementById('obj_scaling').value / 2);
    }

    /**
     * check if a given point lies inside the circle
     * @param {Number} x the x coordinate of the point
     * @param {Number} y the y coordinate of the point
     * @returns wether the point lies inside the circle
     */
    in(x,y) {
        return Math.sqrt(Math.pow((this.get_x() - x),2) + Math.pow((this.get_y() - y),2)) < Circle.get_radius() / 2;
    }
}

/**
 * class for circle object
 */
class Square extends Geometrics {
    constructor(center, content, text) {
        super(center, content, "square");

        // wether the square is a text box
        this.text = text;
    }

    static get_height() {
        return Circle.get_radius() * 2;
    }
    static get_width() {
        return Square.get_height() * 1.66;
    }

    is_text() {
        return this.text;
    }

    /**
     * check if a given point lies inside the square
     * @param {Number} x the x coordinate of the point
     * @param {Number} y the y coordinate of the point
     * @returns wether the point lies inside the square
     */
    in(x,y) {
        if (this.text) {
            return (Math.abs(this.get_x() - x) < Square.get_width() / 3) && (Math.abs(this.get_y() - y) < Square.get_height() / 4);    
        } else {
            return ((Math.abs(this.get_x() - x) < Square.get_width()) && (Math.abs(this.get_y() - y) < Square.get_height()));
        }
    }
}

/**
 * class for a grouping of multiple objects
 */
class Selection {
    constructor() {

        // list of elements in group
        this.elements = [];

        // coordinate where the group can be dragged by
        this.hold_point = new Dot(0,0);
    }

    /**
     * add object into grouping
     * @param {Number} id the index of the object in the global objects list 
     * @param {Geometrics} input the object to be put in 
     */
    add(id, input) {

        // set hold point on last abd push object into list
        this.hold_point = input.center;            
        this.elements.push([id, [input, 0, 0]]);

        // for all other objects in the selection: reset their difference to the hold point
        for (var i = 0; i < this.elements.length; i++) {
            
            // get current position of object
            var elem_x = this.elements[i][1][0].center.x;
            var elem_y = this.elements[i][1][0].center.y;

            // set distance to hold point 
            this.elements[i][1][1] = elem_x - this.hold_point.x;
            this.elements[i][1][2] = elem_y - this.hold_point.y;
            
        }
    }

    /**
     * check if the selection is a real selection or just 1 object
     * @returns wether the selection contains more then 1 object
     */
    valid() {
        return this.elements.length > 1;
    }
}

class simpleVector {

    constructor(dot) {
        this.x = dot.get_x();
        this.y = dot.get_y();
    }

    normalize() {
        return Math.sqrt( Math.pow(this.x, 2) + Math.pow(this.y, 2) );
    }

    add(vec) {
        return new simpleVector(new Dot(this.x + vec.x, this.y + vec.y));
    }

    sub(vec) {
        return new simpleVector(new Dot(this.x - vec.x, this.y - vec.y));
    }

    multiply(fac) {
        return new simpleVector(new Dot(this.x * fac, this.y * fac));
    }

    static angle(a, b) {
        var delta_x = b.get_x() - a.get_x();
        var delta_y = b.get_y() - a.get_y();

        return Math.atan(delta_y / delta_x);
    }
}