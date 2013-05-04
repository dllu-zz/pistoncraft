var WIDTH = 64, HEIGHT = 64;
var RESOLUTION = 128;
var TOOLBAR_RESOLUTION = 50;
var MINIMAP_RESOLUTION = 3;

var buildings, $buildings, items, $items, wires, $wires, motion;

var cycle = 0;

var TECHTREE = {};

var buildmode;
var BUILDING_SPEC = {
    q:{
        x:0,
        y:0,
        name:'North Piston',
        html:
        '<div class="building piston">\
            <div class="stalk4"></div>\
            <div class="stalk3"></div>\
            <div class="stalk2"></div>\
            <div class="stalk1"></div>\
            <div class="head"></div>\
            <div class="body"></div>\
        </div>'
    }, w:{
        x:1,
        y:0,
        name:'South Piston',
        html:
        '<div class="building piston south">\
            <div class="stalk4"></div>\
            <div class="stalk3"></div>\
            <div class="stalk2"></div>\
            <div class="stalk1"></div>\
            <div class="head"></div>\
            <div class="body"></div>\
        </div>'
    }, e:{
        x:2,
        y:0,
        name:'East Piston',
        html:
        '<div class="building piston east">\
            <div class="stalk4"></div>\
            <div class="stalk3"></div>\
            <div class="stalk2"></div>\
            <div class="stalk1"></div>\
            <div class="head"></div>\
            <div class="body"></div>\
        </div>'
    }, r:{
        x:3,
        y:0,
        name:'West Piston',
        html:
        '<div class="building piston west">\
            <div class="stalk4"></div>\
            <div class="stalk3"></div>\
            <div class="stalk2"></div>\
            <div class="stalk1"></div>\
            <div class="head"></div>\
            <div class="body"></div>\
        </div>'
    }, t:{
        x:4,
        y:0,
        name:'Wall',
        html:
        '<div class="building wall"></div>'
    }, a:{
        x:0,
        y:1,
        name:'Circle Mold',
        html:
        '<div class="building mold circle">\
            <div class="body"></div>\
            <div class="hole"></div>\
        </div>'
    }, s:{
        x:1,
        y:1,
        name:'Square Mold',
        html:
        '<div class="building mold square">\
            <div class="body"></div>\
            <div class="hole"></div>\
        </div>'
    }, d:{
        x:2,
        y:1,
        name:'Bullet Mold',
        html:
        '<div class="building mold bullet">\
            <div class="body"></div>\
            <div class="hole"></div>\
        </div>'
    }, f:{
        x:3,
        y:1,
        name:'Trash Chute',
        html:
        '<div class="building trash">\
            <div class="body"></div>\
            <div class="hole"></div>\
        </div>'
    }, g:{
        x:4,
        y:1,
        name:'Container',
        html:
        '<div class="building box"></div>'
    }, z:{
        x:0,
        y:2,
        name:'Clock',
        html:
        '<div class="building clock"></div>'
    }, x:{
        x:1,
        y:2,
        name:'Wire'
    }
};

var WIRENAMES = {
    WIRE: 128, // 1...0000: idle wire - do not actuate pistons
    WIRE1: 129,// 1...0001
    WIRE2: 130,// 1...0010
    WIRE3: 132,// 1...0100
    WIRE4: 136,// 1...1000
    NOTHING: 0// 000: nothing
};


$(document).ready(function() {
    init();
});

function init() {
    sizes();
    window.onresize = sizes;
    
    buildings = [];
    $buildings = [];
    items = [];
    $items = [];
    wires = [];
    $wires = [];
    for(var y=0; y<HEIGHT; y++) {
        buildings[y] = [];
        $buildings[y] = [];
        items[y] = [];
        $items[y] = [];
        wires[y] = [];
        $wires[y] = [];
        for(var x=0; x<WIDTH; x++) {
            $('#lattice').append(
                $('<div>').addClass('cell').css({
                    top:y*RESOLUTION+'px',
                    left:x*RESOLUTION+'px'
                }).data({x:x, y:y})
            );
        }
    }
    $('.cell').click(cellclick);
    $('.cell').hover(cellin, function() {$('.info-layer, .info-layer-caption').html('');});
    ui_init();
};

function sizes() {
    var xsize = window.innerWidth, ysize = window.innerHeight;
    $('#viewport').css({width:xsize+'px', height:ysize-200+'px'});
    $('#ui').css({width:xsize+'px'});
};

function ui_init() {

    $.each(BUILDING_SPEC, function(k, v) {
        var $button = $('<div>').addClass('button').html(v.html).css({
            left: v.x*TOOLBAR_RESOLUTION + 'px',
            top: v.y*TOOLBAR_RESOLUTION + 'px'
        }).data({
            mode:k
        }).attr('id',k);
        $('#toolbar').append($button);
    });
    $('.button').click(function() {
        $('.button').removeClass('selected');
        $(this).addClass('selected');
        buildmode = $(this).data('mode');
        $('#thumbnail').html('');
        $('#thumbnail').append(
            $('<div>').addClass('caption').text(BUILDING_SPEC[buildmode].name)
        ).append(
            $(BUILDING_SPEC[buildmode].html).css({
                top:'36px',
                left:'36px'
            })
        );
    });
    $('#q').click();
    update_minimap();
};

function cellclick() {
    var $this = $(this);
    var x = $this.data('x'), y = $this.data('y');
    if(buildings[y][x] === undefined) {
        var $z = $(BUILDING_SPEC[buildmode].html);
        $z.css({
            top: y*RESOLUTION + 'px',
            left: x*RESOLUTION + 'px'
        }).data({x:x, y:y});
        $('#buildings').append($z);

        $buildings[y][x] = $z;
        buildings[y][x] = buildmode;
    }
    update_minimap();
};

function cellin() {
    var $this = $(this);
    var x = $this.data('x'), y = $this.data('y');
    $('#xy').text(x + ', ' + y);
    $('.info-layer, .info-layer-caption').html('');
    if(items[y][x] !== undefined) {
        $('#info-items').append(
            $items[y][x].clone().css({top:0,left:0})
        );
        $('#info-items-caption').text();
    }
    if(buildings[y][x] !== undefined) {
        $('#info-buildings').append(
            $buildings[y][x].clone().css({top:0,left:0})
        );
        $('#info-buildings-caption').text(BUILDING_SPEC[buildings[y][x]].name);
    }
    if(wires[y][x] !== undefined) {
        $('#info-wires').append(
            $wires[y][x].clone().css({top:0,left:0})
        );
        $('#info-wires-caption').text();
    }
    //if(terrain[y][x] !== undefined) $('#info-terrain').append($terrain[y][x]);
};

function update_minimap() {
    var minimap = $('#minimap')[0];
    var context = minimap.getContext('2d');
    context.clearRect(0,0,minimap.width, minimap.height);
    context.beginPath();
    context.rect(0,0,minimap.width, minimap.height);
    context.fillStyle = '#eee';
    context.fill();
    for(var x=0; x<WIDTH; x++) {
        for(var y=0; y<WIDTH; y++) {
            var _color = undefined;
            if(
                buildings[y][x] === 'q' ||
                buildings[y][x] === 'w' ||
                buildings[y][x] === 'e' ||
                buildings[y][x] === 'r') {
                _color = '#da0';
            } else if(
                buildings[y][x] === 'a' ||
                buildings[y][x] === 's' ||
                buildings[y][x] === 'd') {
                _color = '#777';
            } else if(
                buildings[y][x] === 't') {
                _color = '#555';
            } else if(
                buildings[y][x] === 'g') {
                _color = '#aaa';
            } else if(
                buildings[y][x] === 'f') {
                _color = '#222';
            } else if(
                buildings[y][x] === 'z') {
                _color = '#58f'
            }
            if(_color !== undefined) {
                context.beginPath();
                context.rect(
                    x*MINIMAP_RESOLUTION,
                    y*MINIMAP_RESOLUTION,
                    MINIMAP_RESOLUTION,
                    MINIMAP_RESOLUTION);
                context.fillStyle = _color;
                context.fill();
            }
        }
    }
};
