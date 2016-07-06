/**
 * Created by lilei on 2016/7/6.
 */
/**
 * Created by lilei on 2016/6/6.
 */
var d2 =(function(window){
    function getCodeLen(str) {
        ///<summary>获得字符串实际长度，中文2，英文1</summary>
        ///<param name="str">要获得长度的字符串</param>
        var realLength = 0, len = str.length, charCode = -1;
        for (var i = 0; i < len; i++) {
            charCode = str.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128) realLength += 1;
            else realLength += 2;
        }
        return realLength;
    }
    function deepCopy(p, c) {
        var c = c || {};
        for (var i in p) {
            if (typeof p[i] === 'object') {
                c[i] = (p[i].constructor === Array) ? [] : {};
                deepCopy(p[i], c[i]);
            } else {
                c[i] = p[i];
            }
        }
        return c;
    }


    var uuid = new Date().valueOf();
    var _d2 = {
        root: document.getElementsByTagName('svg')[0],
        fontSize: 12,
        DomCache: {},
        LineCache:{},
        bindView: function (svg) {
            this.root = svg;
        },
        data: function (obj) {
            if(obj.id){
                uuid = obj.id;
                this.DomCache[obj.id] = obj;
            }else{
                uuid = new Date().valueOf();
                this.DomCache[uuid] = obj;
            }

            return d2;
        },
        on:function(type,func){
            var obj = this.DomCache[uuid];
            obj.dg.addEventListener(type,func);
            return d2;
        },
        create: function (type) {
            var obj = this.DomCache[uuid];
            if (type == 'rect') {
                var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
                g.setAttribute('key', uuid);
                g.setAttribute('transform', 'translate(' + obj.p.x + ',' + obj.p.y + ')');
//                delete obj.g;
                var r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                obj.x = -obj.width / 2;
                for (var i in obj) {
                    if (i != 'p') {
                        r.setAttribute(i, obj[i]);
                    }
                }
                g.appendChild(r);
                obj.dg = g;
                this.root.appendChild(g);
                return d2;
            }else{
                alert('暂时只支持创建rect形状的元素~~~');
            }
        },
        text: function (attr) {
            var txt = attr.txt;
            delete attr.txt;
            var obj = this.DomCache[uuid];
            var t = document.createElementNS("http://www.w3.org/2000/svg", "text");
            t.setAttribute('fill-opacity', 1);
            t.setAttribute('x', -obj.width / 2 + (obj.width - getCodeLen(txt)/2 * this.fontSize) / 2);
            t.setAttribute('dy', obj.height / 2 + this.fontSize / 3);
            for (var i in attr) {
                t.setAttribute(i, attr[i]);
            }
            t.innerHTML = txt;
            obj.dg.appendChild(t);
            return d2;
        },
        line: function (/* point1,point2.... */) {
            var l = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
            var points = Array.prototype.slice.call(arguments);
            var style = points.pop();
            var start = points[0];
            var last = points[points.length - 1];
            var startPoint = deepCopy(start.p);
            var lastPoint = deepCopy(last.p);
            //根据start ,  to判断 起点和终点在框框上下左右方向  默认为上边框中间点
            if (!style.start) {
                style.start = 'top'
            }
            if (style.start == "right") {
                startPoint.x = startPoint.x + start.width / 2;
                startPoint.y = startPoint.y + start.height / 2;
            } else if (style.start == "bottom") {
                startPoint.y = startPoint.y + start.height;
            } else if (style.start == "left") {
                startPoint.x = startPoint.x - start.width / 2;
                startPoint.y = startPoint.y + start.height / 2;
            } else {
                //默认top点
            }
            if (!style.to) {
                style.to = 'top'
            }
            if (style.to == "right") {
                lastPoint.x = lastPoint.x + last.width / 2;
                lastPoint.y = lastPoint.y + last.height / 2;
            } else if (style.to == "bottom") {
                lastPoint.y = lastPoint.y + last.height;
            } else if (style.to == "left") {
                lastPoint.x = lastPoint.x - last.width / 2;
                lastPoint.y = lastPoint.y + last.height / 2;
            } else {
                //默认top点
            }
            //起点
            var pointStr = startPoint.x + "," + startPoint.y + " ";
            //中间折线点
            if(points.length>2){
                for (var i = 1, len = points.length - 1; i < len; i++) {
                    pointStr += points[i].p.x + "," + points[i].p.y + " ";
                }
            }else if(style.to=='top' || style.to=='bottom'){
                pointStr += startPoint.x + "," + (startPoint.y - (startPoint.y - lastPoint.y)/2) + " ";
                pointStr += lastPoint.x + "," + (startPoint.y - (startPoint.y - lastPoint.y)/2) + " ";
            }else if(style.to=='left' || style.to=='right'){
                pointStr += (startPoint.x - (startPoint.x - lastPoint.x)/2) + "," + lastPoint.y + " ";
                pointStr += lastPoint.x + "," + lastPoint.y + " ";
            }

            //终点
            pointStr += lastPoint.x + "," + lastPoint.y + " ";

            //判断箭头方向
            if (style.to == 'top' || style.to == 'bottom') {
                var arrow = {x: 5, y: -7};
                if ((lastPoint.y - points[0].p.y) < 0) {
                    arrow = {x: -5, y: 7};
                }
                pointStr += (lastPoint.x + arrow.x) + ',' + (lastPoint.y + arrow.y) + " ";
                pointStr += lastPoint.x + ',' + lastPoint.y + " ";
                pointStr += (lastPoint.x - arrow.x) + ',' + (lastPoint.y + arrow.y) + " ";
            } else {
                var arrow2 = {x: 7, y: -5};//->
                if ((lastPoint.x - points[0].p.x) < 0) {
                    arrow2 = {x: -7, y: 5};//<-
                }
                pointStr += (lastPoint.x - arrow2.x) + ',' + (lastPoint.y - arrow2.y) + " ";
                pointStr += lastPoint.x + ',' + lastPoint.y + " ";
                pointStr += (lastPoint.x - arrow2.x) + ',' + (lastPoint.y + arrow2.y) + " ";
            }
            l.setAttribute('points', pointStr);
            for (var j in style) {
                if (j == 'style') {
                    l.setAttribute(j, 'fill:transparent;' + style[j]);
                } else {
                    l.setAttribute(j, style[j]);
                }
            }
            //缓存线路径dom
            if(style.group){
                if(this.LineCache[style.group]){
                    this.LineCache[style.group].push(l);
                } else{
                    this.LineCache[style.group] = [l];
                }
            }
            this.root.appendChild(l);
        }
    };
    return _d2;
})(window);
