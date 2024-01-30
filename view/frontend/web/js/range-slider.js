(function () {
    'use strict';

    $.mixin('rangeSlider', {
        _createSlider: function () {
            this._on('range:input', (e) => {
                this._onSliderChange(e, {
                    values: e.target.value
                });
            });
        }
    });
}());
