
    class Dot {
        constructor(x, y) {
            this.x = x;
            this.y = y;
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

    class Geometrics {
        constructor(center, content, type) {
            this.type = type;
            this.center = center;
            this.selected = false;
            this.content = content;
            this.moveable = false;
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
                return '#0000ff'
            } else {
                return '#000000'
            }
        }

    }

    class Line {
        constructor(s, e) {
            this.s = s;
            this.e = e;
            this.selected = false;
            this.content = lines.length;
            this.moveable = false;
        }

        select() {
            this.selected = true;
        }

        deselect() {
            this.selected = false;
            this.moveable = false;
        }

        get_color() {
            if (this.selected) {
                return 'black'
            } else {
                return '#000000'
            }
        }
    }

    class Circle extends Geometrics {
        constructor(center, content) {
            super(center, content, "circle");
        }

        in(x,y) {
            return Math.sqrt(Math.pow((this.get_x() - x),2) + Math.pow((this.get_y() - y),2)) < radius / 2;
        }
    }

    class Square extends Geometrics {
        constructor(center, content, text) {
            super(center, content, "square");
            this.text = text;
        }

        is_text() {
            return this.text;
        }

        in(x,y) {
            if (this.text) {
                return (Math.abs(this.get_x() - x) < square_w / 3) && (Math.abs(this.get_y() - y) < square_h / 4);    
            } else {
                return ((Math.abs(this.get_x() - x) < square_w) && (Math.abs(this.get_y() - y) < square_h));
            }
        }
    }

    class Selection {
        constructor() {
            this.elements = [];
            this.hold_point = new Dot(0,0);
            this.recalibrate = false;
        }

        add(id, input) {

            this.hold_point = input.center;
            
            for (var i = 0; i < this.elements.length; i++) {
                
                var elem_x = this.elements[i][1][0].center.x;
                var elem_y = this.elements[i][1][0].center.y;

                this.elements[i][1][1] = elem_x - this.hold_point.x;
                this.elements[i][1][2] = elem_y - this.hold_point.y;
                
            }
            
            this.elements.push([id, [input, 0, 0]]);
            
        }

        valid() {
            return this.elements.length > 1;
        }
    }