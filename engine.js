var WIDTH = 64, HEIGHT = 64;
var RESOLUTION = 128;
var MINIMAP_RESOLUTION = 3;

var buildings, $buildings, items, $items, wires, $wires;

var TECHTREE = {};

var buildmode = 0;
var buildings_spec = {
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
    }
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
    $('.cell').click(make_building);
    ui_init();
};

function sizes() {
    var xsize = window.innerWidth, ysize = window.innerHeight;
    $('#viewport').css({width:xsize+'px', height:ysize-200+'px'});
    $('#ui').css({width:xsize+'px'});
};

function ui_init() {

    $.each(buildings_spec, function(k, v) {
        var $button = $('<div>').addClass('button').html(v.html).css({
            left: v.x*RESOLUTION/2 + 'px',
            top: v.y*RESOLUTION/2 + 'px'
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
            $('<div>').addClass('caption').text(buildings_spec[buildmode].name)
        ).append(
            $(buildings_spec[buildmode].html).css({
                top:'36px',
                left:'36px'
            })
        );
    });
    $('#q').click();
    update_minimap();
};

function make_building() {
    var $this = $(this);
    var x = $this.data('x'), y = $this.data('y');
    if(buildings[y][x] === undefined) {
        var $z = $(buildings_spec[buildmode].html);
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
            if(
                buildings[y][x] === 'q' ||
                buildings[y][x] === 'w' ||
                buildings[y][x] === 'e' ||
                buildings[y][x] === 'r') {
                context.beginPath();
                context.rect(
                    x*MINIMAP_RESOLUTION, 
                    y*MINIMAP_RESOLUTION, 
                    MINIMAP_RESOLUTION, 
                    MINIMAP_RESOLUTION);
                context.fillStyle = '#da0';
                context.fill();
            } else if(
                buildings[y][x] === 'a' ||
                buildings[y][x] === 's' ||
                buildings[y][x] === 'd') {
                context.beginPath();
                context.rect(
                    x*MINIMAP_RESOLUTION, 
                    y*MINIMAP_RESOLUTION, 
                    MINIMAP_RESOLUTION, 
                    MINIMAP_RESOLUTION);
                context.fillStyle = '#777';
                context.fill();
            }
        }
    }
};