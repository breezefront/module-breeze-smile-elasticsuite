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

    $(document).on('breeze:mount:rangeSlider', (e, data) => {
        $(data.el).rangeSlider(data.settings);
    });
}());
