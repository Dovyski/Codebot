/*
	The MIT License (MIT)

	Copyright (c) 2015 Fernando Bevilacqua

	Permission is hereby granted, free of charge, to any person obtaining a copy of
	this software and associated documentation files (the "Software"), to deal in
	the Software without restriction, including without limitation the rights to
	use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
	the Software, and to permit persons to whom the Software is furnished to do so,
	subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
	FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
	COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
	IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
	CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

// Namespace for the asset finder plugin
var SoundCentral = SoundCentral || {};

// Namespace for panels
SoundCentral.Panel = SoundCentral.Panel || {};
/**
 * The main panel to be displayed when the user clicks the
 * sound central icon.
 */
SoundCentral.Panel.Main = function() {
    // Call constructor of base class
    Codebot.Panel.call(this, 'SFX and Music');

    this.mParameters = {
        sound_vol: {label: 'Volume', unit: function (v) { v = 10 * Math.log(v*v) / Math.log(10); var sign = v >= 0 ? '+' : ''; return sign + v.toPrecision(4) + ' dB'; }, convert: function (v) { return Math.exp(v) - 1; }},

        g_envelope: {group: 'Envelope'},
        p_env_attack: {label: 'Attack time', unit: function (v) { return (v / 44100).toPrecision(4) + ' s' }, convert: function (v) { return v * v * 100000.0 }},
        p_env_sustain: {label: 'Sustain time', unit: function (v) { return (v / 44100).toPrecision(4) + ' s' }, convert: function (v) { return v * v * 100000.0 }},
        p_env_punch: {label: 'Sustain punch', unit: function (v) { return '+' + (v * 100).toPrecision(4) + '%'}, convert: function (v) { return v }},
        p_env_decay: {label: 'Decay time', unit: function (v) { return (v / 44100).toPrecision(4) + ' s' }, convert: function (v) { return v }},

        g_frequency: {group: 'Frequency'},
        p_base_freq: {label: 'Start', unit: 'Hz', convert: function (v) { return 8 * 44100 * (v * v + 0.001) / 100 }},
        p_freq_limit: {label: 'Min cutoff', unit: 'Hz', convert: function (v) { return 8 * 44100 * (v * v + 0.001) / 100 }},
        p_freq_ramp: {label: 'Slide', unit: function (v) { return (44100*Math.log(v)/Math.log(0.5)).toPrecision(4) + ' 8va/s'; }, convert: function (v) { return 1.0 - Math.pow(v, 3.0) * 0.01 }, signed: true},
        p_freq_dramp: {label: 'Delta slide', unit: function (v) { return (v*44100 / Math.pow(2, -44101./44100)).toPrecision(4) +' 8va/s&sup2;'; }, convert: function (v) { return -Math.pow(v, 3.0) * 0.000001 }, signed: true},

        g_vibrato: {group: 'Vibrato'},
        p_vib_strength: {label: 'Depth', unit: function (v) { return v === 0 ? 'OFF' : '&plusmn; ' + (v*100).toPrecision(4) + '%' }, convert: function (v) { return v * 0.5 }},
        p_vib_speed: {label: 'Speed', unit: function (v) { return v === 0 ? 'OFF' : (441000/64. * v).toPrecision(4) + ' Hz'}, convert: function (v) { return Math.pow(v, 2.0) * 0.01 }},

        g_arpeggiation: {group: 'Arpeggiation'},
        p_arp_mod: {label: 'Freq. mult', unit: function (v) { return ((v === 1) ? 'OFF' : 'x ' + (1./v).toPrecision(4)) }, convert: function (v) { return v >= 0 ? (1.0 - Math.pow(v, 2) * 0.9) : (1.0 + Math.pow(v, 2) * 10); }, signed: true},
        p_arp_speed: {label: 'Change speed', unit: function (v) { return (v === 0 ? 'OFF' : (v / 44100).toPrecision(4) +' s') }, convert: function (v) { return (v === 1.0) ? 0 : Math.floor(Math.pow(1.0 - v, 2.0) * 20000 +32)}},

        g_duty_cycle: {group: 'Duty Cycle'},
        p_duty: {label: 'Duty cycle', unit: function (v) { return (100 * v).toPrecision(4) + '%'; }, convert: function (v) { return 0.5 - v * 0.5; }},
        p_duty_ramp: {label: 'Sweep', unit: function (v) { return (8 * 44100 * v).toPrecision(4) +'%/s'}, convert: function (v) { return -v * 0.00005 }, signed: true},

        g_retrigger: {group: 'Retrigger'},
        p_repeat_speed: {label: 'Rate', unit: function (v) { return v === 0 ? 'OFF' : (44100/v).toPrecision(4) + ' Hz' }, convert: function (v) { return (v === 0) ? 0 : Math.floor(Math.pow(1-v, 2) * 20000) + 32 }},

        g_flanger: {group: 'Flanger'},
        p_pha_ramp: {label: 'Sweep', unit: function (v) { return v === 0 ? 'OFF' : (1000*v).toPrecision(4) + ' ms/s' }, convert: function (v) { return (v < 0 ? -1 : 1) * Math.pow(v,2) }},

        g_low_pass_filter: {group: 'Low-Pass Filter'},
        p_pha_offset: {label: 'Offset', unit: function (v) { return v === 0 ? 'OFF' : (1000*v/44100).toPrecision(4) + ' ms' } , convert: function (v) { return (v < 0 ? -1 : 1) * Math.pow(v,2)*1020 }, signed: true},
        p_lpf_freq: {label: 'Cutoff freq.', unit: function (v) { return (v === .1) ? 'OFF' : Math.round(8 * 44100 * v / (1-v)) + ' Hz'; }, convert: function (v) { return Math.pow(v, 3) * 0.1 }, signed: true},
        p_lpf_ramp: {label: 'Cutoff sweep', unit: function (v) {  if (v === 1) return 'OFF'; return Math.pow(v, 44100).toPrecision(4) + ' ^s'; }, convert: function (v) { return 1.0 + v * 0.0001 }, signed: true},
        p_lpf_resonance: {label: 'Resonance', unit: function (v) { return (100*(1-v*.11)).toPrecision(4)+'%';}, convert: function (v) { return 5.0 / (1.0 + Math.pow(v, 2) * 20) }},

        g_high_pass_filter: {group: 'High-Pass Filter'},
        p_hpf_freq: {label: 'Cutoff freq.', unit: function (v) { return (v === 0) ? 'OFF' : Math.round(8 * 44100 * v / (1-v)) + ' Hz'; }, convert: function (v) { return Math.pow(v, 2) * 0.1 }},
        p_hpf_ramp: {label: 'Cutoff sweep', unit: function (v) {  if (v === 1) return 'OFF'; return Math.pow(v, 44100).toPrecision(4) + ' ^sec'; }, convert: function (v) { return 1.0 + v * 0.0003 }, signed: true}
    };
};

// Lovely pants-in-the-head javascript boilerplate for OOP.
SoundCentral.Panel.Main.prototype = Object.create(Codebot.Panel.prototype);
SoundCentral.Panel.Main.prototype.constructor = SoundCentral.Panel.Main;

Params.prototype.query = function() {
  var result = "";
  var that = this;
  $.each(this, function (key,value) {
    if (that.hasOwnProperty(key))
      result += "&" + key + "=" + value;
  });
  return result.substring(1);
};

var PARAMS;
var SOUND;
var SOUND_VOL = 0.25;
var SAMPLE_RATE = 44100;
var SAMPLE_SIZE = 8;

SoundCentral.Panel.Main.prototype.gen = function(fx) {
  PARAMS = new Params();
  PARAMS.sound_vol = SOUND_VOL;
  PARAMS.sample_rate = SAMPLE_RATE;
  PARAMS.sample_size = SAMPLE_SIZE;
  PARAMS[fx]();

  $("#wav").text(fx + ".wav");
  this.updateUi();
  this.play();
};

SoundCentral.Panel.Main.prototype.mut = function() {
  PARAMS.mutate();
  this.updateUi();
  this.play();
};

SoundCentral.Panel.Main.prototype.play = function() {
    var aAudio,
        aData;

    aData = new SoundEffect(PARAMS).generate();

    $("#file_size").text(Math.round(aData.wav.length / 1024) + "kB");
    $("#num_samples").text(aData.header.subChunk2Size / (aData.header.bitsPerSample >> 3));
    $("#clipping").text(aData.clipping);

    aAudio = new Audio();
    aAudio.onloadeddata = function(theEvent) {
        this.play();
    };

    // Load the sound
    aAudio.src = aData.dataURI;
};

SoundCentral.Panel.Main.prototype.disenable = function() {
  var duty = PARAMS.wave_type == SQUARE || PARAMS.wave_type == SAWTOOTH;
  //$("#p_duty").slider("option", "disabled", !duty);
  //$("#p_duty_ramp").slider("option", "disabled", !duty);
}

SoundCentral.Panel.Main.prototype.updateUi = function() {
  $.each(PARAMS, function (param, value) {
    if (param == "wave_type") {
      $("#shape input:radio[value=" + value + "]").
        prop('checked', true).button("refresh");
    } else if (param == "sample_rate") {
      $("#hz input:radio[value=" + value + "]").
        prop('checked', true).button("refresh");
    } else if (param == "sample_size") {
      $("#bits input:radio[value=" + value + "]").
        prop('checked', true).button("refresh");
    } else {
      var id = "#" + param;
      //$(id).slider("value", 1000 * value);
      //$(id).each(function(){this.convert(this, PARAMS[this.id]);});
    }
  });
  this.disenable();
};

SoundCentral.Panel.Main.prototype.initUI = function() {
    var aSelf = this,
        aControl,
        aParam,
        p;

    // Init all UI elements with convertion and unit functions.
    for (p in this.mParameters) {
        aParam = this.mParameters[p];

        if(!aParam.group) {
            aControl = $('#' + p)[0];
            aControl.convert = aParam.convert;
            aControl.units = aParam.unit;
        }
    }

  $("#shape").buttonset();
  $("#hz").buttonset();
  $("#bits").buttonset();
  $("#shape input:radio").change(function (event) {
    PARAMS.wave_type = parseInt(event.target.value);
    aSelf.disenable();
    aSelf.play();
  });
  $("#hz input:radio").change(function (event) {
    SAMPLE_RATE = PARAMS.sample_rate = parseInt(event.target.value);
    aSelf.play();
  });
  $("#bits input:radio").change(function (event) {
    SAMPLE_SIZE = PARAMS.sample_size = parseInt(event.target.value);
    aSelf.play();
  });
  $("button").button();
  $(".slider").slider({
    value: 1000,
    min: 0,
    max: 1000,
    slide: function (event, ui) {
      aSelf.convert(event.target, ui.value / 1000.0);
    },
    change: function(event, ui) {
      if (event.originalEvent) {
        PARAMS[event.target.id] = ui.value / 1000.0;
        aSelf.convert(event.target, PARAMS[event.target.id]);
        aSelf.play();
      }
    }
  });
  $(".slider").filter(".signed").
    slider("option", "min", -1000).
    slider("value", 0);
    $('.slider').each(function () {
      var is = this.id;
      if (!$('label[for="' + is + '"]').length)
        $(this).parent().parent().find('th').append($('<label>',
                                                      {for: is}));
    });

    $('input[type=range]').each(function (theIndex, theElement) {
        //$(theElement).parent().append($('<label for="' + this.id + '">test</label>'));

        $(theElement).on('input change', function(theEvent) {
            PARAMS[theEvent.target.id] = $(this).val() / 1000.0;
            aSelf.convert(theEvent.target, PARAMS[theEvent.target.id]);

            if(theEvent.type == 'change') {
                aSelf.play();
            }
        });
    });

  this.gen("pickupCoin");

  $('#sound-central-generators button').click(function() {
      aSelf.gen($(this).data('generator'));
  });

  $('#sndc-btn-play').click(function() {
      aSelf.play();
  });
};

SoundCentral.Panel.Main.prototype.convert = function(control, v) {
  if (control.convert) {
    v = control.convert(v);
    control.convertedValue = v;
    if (typeof control.units === 'function')
      v = control.units(v);
    else
      v = v.toPrecision(4) + ' ' + control.units;
    $('label[for="' + control.id + '"]').html(v);
  }
};

SoundCentral.Panel.Main.prototype.render = function() {
    var aSelf = this,
        aParam,
        aItem,
        aContent = '';

    Codebot.Panel.prototype.render.call(this);

    this.divider('Generators');
    this.row(
        '<div id="sound-central-generators">' +
            '<button class="square" data-generator="pickupCoin"><i class="fa fa-star"></i><label>Pickup</label></button>' +
            '<button class="square" data-generator="laserShoot"><i class="fa fa-fire"></i><label>Shoot</label></button>' +
            '<button class="square" data-generator="explosion"><i class="fa fa-bomb"></i><label>Explosion</label></button>' +
            '<button class="square" data-generator="powerUp"><i class="fa fa-bolt"></i><label>PowerUp</label></button>' +
            '<button class="square" data-generator="hitHurt"><i class="fa fa-legal"></i><label>Hit</label></button>' +
            '<button class="square" data-generator="jump"><i class="fa fa-level-up"></i><label>Jump</label></button>' +
            '<button class="square" data-generator="blipSelect"><i class="fa fa-bell"></i><label>Blip</label></button>' +
            '<button class="square" data-generator="random"><i class="fa fa-magic"></i><label>Random</label></button>' +
            '<button class="square" data-generator="tone"><i class="fa fa-phone"></i><label>Tone</label></button>' +
        '</div>'
    );

    this.row(
        'Recently generated' +
        '<select id="sfx-selector" style="width: 100%;>' +
            '<option value="0" selected="selected">Explosion 2</option>' +
            '<option value="1">Hit 1</option>' +
            '<option value="2">Explosion 1</option>' +
            '<option value="3">Pikcup 1</option>' +
        '</select>');

    this.divider('Result', {icon: 'play-circle'});

    this.row('<img src="http://0d47eeef2abf05521f71-1e80f65b3c6327b7cb4b0619fd21f75b.r59.cf2.rackcdn.com/b975a7830746af52689442fb2dc39eab.jpeg" style="width: 100%; height: 50px;" />', true);

    this.row(
        '<div style="width: 24%; float: left; margin-right: 2px;">' +
            '<button id="sndc-btn-play" class="square"><i class="fa fa-play"></i></button>' +
        '</div>' +
        '<div style="width: 75%; float: right;">' +
            '<strong>Explosion1.wav</strong>' +
            '<p><span id="file_size"></span>, <span id="num_samples"></span> samples, clipped <span id="clipping"></span>.</p>' +
        '</div>' +

        '<div style="width: 100%; clear: both;">' +

        '<div style="width: 70%; float: left;">' +
            '<i class="fa fa-folder-open"></i>' +
            '<select id="sfx-selector" style="width: 80%;">' +
                '<option value="0" selected="selected">/assets</option>' +
                '<option value="1">/</option>' +
            '</select>' +
        '</div>' +
        '<div style="width: 30%; float: left;">' +
            '<button id="btn-play" style="width: 100%;"><i class="fa fa-download"></i> Add</button>' +
        '</div>'
    );

    this.divider('Manual adjustments', {icon: 'sliders'});

    this.pair('Sample rate',
        '<select name="hz" id="hz">' +
            '<option value="44100" selected="selected">44k Hz</option>' +
            '<option value="22050">22k Hz</option>' +
            '<option value="11025">11k Hz</option>' +
            '<option value="5512">6K Hz</option>' +
        '</select>');

    this.pair('Sample size',
        '<select name="bits" id="bits">' +
            '<option value="16">16 bits</option>' +
            '<option value="8" selected="selected">8 bits</option>' +
        '</select>');

    this.pair('Shape',
        '<select name="shape" id="shape">' +
            '<option value="0">Square</option>' +
            '<option value="1" selected="selected">Sawtooth</option>' +
            '<option value="2">Sine</option>' +
            '<option value="3">Noise</option>' +
        '</select>');

    for(aParam in this.mParameters) {
        aItem = this.mParameters[aParam];

        // If we find a group entry, add a new line
        if(aItem.group) {
            // If we already have content for the current group, render it now
            if(aContent != '') {
                this.row(aContent);
                aContent = '';
            }
            // Render the title of the next group
            this.row(aItem.group);

        } else {
            // Otherwise continue adding UI for the current group
            // TODO: remove in-line style?
            aContent +=
                '<ul>' +
                    '<li style="position: relative;">' +
                        '<p style="float: left; width: 35%;">' + aItem.label + '</p>' +
                        '<div style="float: left; width: 30%; margin: -10px 5px 0 5px;"><input type="range" id="' + aParam + '" min="0" max="1000" /></div>' +
                        '<label for="' + aParam + '" style="float: left; width: 30%; text-align: right;">0.000s</label>' +
                    '</li>' +
                '</ul>';
        }
    }

    // Render the group
    this.row(aContent);

    this.initUI();
};
