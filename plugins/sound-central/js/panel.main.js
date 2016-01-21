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

    this.mSfxr = new Params();      // Params is defined in "jsfxr/sfxr.js".
    this.mCounters = {};
    this.mSfxData = null;           // Generated data (wav) of the last generated sfx
    this.mSfxLabel = '';            // Name (e.g. 'explosion') of the last generated sfx
    this.mWaveSurfer = null         // The entity that will render the SFX wave.

    // Init everything
    this.init();
};

// Lovely pants-in-the-head javascript boilerplate for OOP.
SoundCentral.Panel.Main.prototype = Object.create(Codebot.Panel.prototype);
SoundCentral.Panel.Main.prototype.constructor = SoundCentral.Panel.Main;

SoundCentral.Panel.Main.prototype.init = function() {
    var aSelf = this;

    // Set defaults for JSFXR
    this.mSfxr.sound_vol = 0.25;
    this.mSfxr.sample_rate = 44100;
    this.mSfxr.sample_size = 8;
};

SoundCentral.Panel.Main.prototype.generate = function() {
    if(this.mSfxData) {
        this.mSfxData = null;
        // TODO: implementing some destroy() method would be great
    }

    this.mSfxData = new SoundEffect(this.mSfxr).generate();
    this.mWaveSurfer.loadBlob(this.dataURItoBlob(this.mSfxData.dataURI)); // Will play as soon as it loads...

    this.updateUI();
};

SoundCentral.Panel.Main.prototype.adjustParamsAccordingPreset = function(theFx) {
    this.mSfxLabel = theFx;
    this.mSfxr[theFx]();

    if(!this.mCounters[theFx]) {
      this.mCounters[theFx] = 0;
    }

    this.generate(); // will play automatically
};

SoundCentral.Panel.Main.prototype.mutate = function() {
    this.mSfxr.mutate();
    this.updateUI();
    this.generate();
};

SoundCentral.Panel.Main.prototype.play = function() {
    // Load the wav data into the audio player
    if(this.mSfxData) {
        this.mWaveSurfer.loadBlob(this.dataURItoBlob(this.mSfxData.dataURI));
    }
    this.mWaveSurfer.play();
};

SoundCentral.Panel.Main.prototype.updateUI = function() {
    var aDuty,
        aSelf = this,
        aMapping = {
            'wave_type': '#shape',
            'sample_rate': '#hz',
            'sample_size': '#bits'
        },
        aDuty;

    if(this.mSfxData) {
        // Update file name, size, etc.
        $('#sndc-file-name').text(this.mSfxLabel + this.mCounters[this.mSfxLabel] + '.wav');
        $("#file_size").text(Math.round(this.mSfxData.wav.length / 1024) + "kB");
        $("#num_samples").text(this.mSfxData.header.subChunk2Size / (this.mSfxData.header.bitsPerSample >> 3));
        $("#clipping").text(this.mSfxData.clipping);
    }

    // Adjust all other manual settings
    $.each(this.mSfxr, function (theParam, theValue) {
        if(aMapping[theParam]) {
            $(aMapping[theParam]).val(theValue);

        } else {
            $('#' + theParam).val(1000 * theValue);
        }
    });

    // Disable Duty elements according to wave type
    aDuty = this.mSfxr.wave_type == SQUARE || this.mSfxr.wave_type == SAWTOOTH;
    $('#p_duty').prop('disabled', !aDuty);
    $('#p_duty_ramp').prop('disabled', !aDuty);
};

SoundCentral.Panel.Main.prototype.initUI = function() {
    var aSelf = this,
        aControl,
        aParam,
        p,
        aMapping;

    aMapping = {
        'shape': 'wave_type',
        'hz': 'sample_rate',
        'bits': 'sample_size'
    };

    // Init all UI elements with convertion and unit functions.
    for (p in this.mParameters) {
        aParam = this.mParameters[p];

        if(!aParam.group) {
            aControl = $('#' + p)[0];
            aControl.convert = aParam.convert;
            aControl.units = aParam.unit;
        }
    }

    this.mWaveSurfer = WaveSurfer.create({
        container: '#sndc-wave',
        waveColor: '#75BFFF',
        progressColor: '#75BFFF',
        height: 50,
        barWidth: 1,
        interact: false,
    });

    this.mWaveSurfer.on('ready', function() {
        aSelf.mWaveSurfer.play();
    });

    $('input[type=range]').each(function (theIndex, theElement) {
        // TODO: check why slider is not dragging
        $(theElement).on('input change', function(theEvent) {
            aSelf.mSfxr[theEvent.target.id] = $(this).val() / 1000.0;
            aSelf.convert(theEvent.target, aSelf.mSfxr[theEvent.target.id]);

            if(theEvent.type == 'change') {
                aSelf.generate();
            }
        });
    });

    $('#shape, #hz, #bits').each(function (theIndex, theElement) {
        $(theElement).on('change', function (theEvent) {
            aSelf.mSfxr[aMapping[theEvent.target.id]] = parseInt(theEvent.target.value);
            aSelf.generate();
        });
    });

    $('#sound-central-generators button').click(function() {
        aSelf.adjustParamsAccordingPreset($(this).data('generator'));
    });

    $('#sndc-btn-play').click(function() {
        aSelf.play();
    });

    $('#sndc-btn-download').click(function() {
        aSelf.addSfxToProject();
    });
 };

// From: http://stackoverflow.com/a/30407840/29827
SoundCentral.Panel.Main.prototype.dataURItoBlob = function(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

SoundCentral.Panel.Main.prototype.addSfxToProject = function() {
    var aFormData = new FormData();
    var aBlob = this.dataURItoBlob(this.mSfxData.dataURI);
    var aXmlHttpRequest = new XMLHttpRequest();

    aFormData.append('path', 'again.wav');
    aFormData.append('method', 'write');
    aFormData.append('file', aBlob);

    aXmlHttpRequest.upload.addEventListener("progress", function() { console.log('PROGRESS!'); }, false);
    aXmlHttpRequest.upload.addEventListener("load", function() { console.log('load!'); }, false);
    aXmlHttpRequest.upload.addEventListener("error", function() { console.log('error!'); }, false);
    aXmlHttpRequest.upload.addEventListener("abort", function() { console.log('abort'); }, false);

    aXmlHttpRequest.open("POST", this.getContext().io.getAPIEndpoint(), true);
    aXmlHttpRequest.send(aFormData);

    console.debug('Sending file to server');
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

    this.row('<div id="sndc-wave" /></div>', true);

    this.row(
        '<div style="width: 24%; float: left; margin-right: 2px;">' +
            '<button id="sndc-btn-play" class="square"><i class="fa fa-play"></i></button>' +
        '</div>' +
        '<div style="width: 75%; float: right;">' +
            '<strong id="sndc-file-name">Explosion1.wav</strong>' +
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
            '<button id="sndc-btn-download" style="width: 100%;"><i class="fa fa-download"></i> Add</button>' +
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
                        '<div style="float: left; width: 30%; margin: -10px 5px 0 5px;"><input type="range" id="' + aParam + '" min="' + (aItem.signed ? '-1000' : '0') + '" max="1000" /></div>' +
                        '<label for="' + aParam + '" style="float: left; width: 30%; text-align: right;">0.000s</label>' +
                    '</li>' +
                '</ul>';
        }
    }

    // Render the group
    this.row(aContent);

    this.initUI();
    this.updateUI();
};
