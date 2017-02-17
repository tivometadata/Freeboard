//
// Plugin for horizontal linear gauge
//
//
freeboard.addStyle('linear-gauge',"width:200px;height:100px;display:inline-block;")
(function() {
    var gaugeWidget = function (settings) {
        var titleElement = $('<h2 class="section-title"></h2>');
        var gaugeElement = $('<div class="linear-gauge"></div>');

        var self = this;
        var paper = null;
        var gaugeFill_Complete = null,gaugeFill_Process = null;
        var width, height;
        var valueText, unitsText;
        var minValueLabel, maxValueLabel;
        //var currentValue = 0;
        //var colors = ["#a9d70b", "#f9c802", "#ff0000"];

        var currentSettings = settings;

        /* get the color for a fill percentage
           these colors match the justGage library for radial guagues */
        function getDynamicColors(fillPercent) {
            // mix colors
            // green rgb(169,215,11) #a9d70b
            // yellow rgb(249,200,2) #f9c802
            // red rgb(255,0,0) #ff0000

            if (fillPercent >= 0.5 ) {
                fillPercent = 2 * fillPercent - 1;
                var R = fillPercent * 255 + (1 - fillPercent) * 249;
                var G = fillPercent * 0 + (1 - fillPercent) * 200;
                var B = fillPercent * 0 + (1 - fillPercent) * 2;
            }
            else {
                fillPercent = 2 * fillPercent;
                var R = fillPercent * 249 + (1 - fillPercent) * 169;
                var G = fillPercent * 200 + (1 - fillPercent) * 215;
                var B = fillPercent * 2 + (1 - fillPercent) * 11;
            }

            return "rgb(" + Math.round(R) + "," + Math.round(G) + "," + Math.round(B) + ")"
        }

		function getColor(color)
		{
			if (color == "Yellow")
				return "rgb(" +249 + "," + 200 + "," +2+ ")" 
			else
				return "rgb(" +169 + "," + 215 + "," +11+ ")"
		}
        function createGauge() {
            width = gaugeElement.width();
            height = 100;

            var gaugeWidth = 160;
            var gaugeHeight = 30;

            paper = Raphael(gaugeElement.get()[0], width, height);
            paper.clear();

            var rect = paper.rect(width / 2 - gaugeWidth / 2, height / 3 - gaugeHeight / 2, gaugeWidth, gaugeHeight);
            rect.attr({
                "fill": "#edebeb",
                "stroke": "#edebeb"
            });

            // place min and max labels
            minValueLabel = paper.text(width / 2 - gaugeWidth / 2 - 8, height / 3, currentSettings.min_value);
            maxValueLabel = paper.text(width / 2 + gaugeWidth / 2 + 8, height / 3, currentSettings.max_value);

            minValueLabel.attr({
                "font-family": "arial",
                "font-size": "10",
                "fill": "#b3b3b3",
                "text-anchor": "end"
            });

            maxValueLabel.attr({
                "font-family": "arial",
                "font-size": "10",
                "fill": "#b3b3b3",
                "text-anchor": "start"
            });

            // place units and value
            var units = _.isUndefined(currentSettings.units) ? "" : currentSettings.units;

            valueText = paper.text(width / 2, height * 2 / 3 , "");
            unitsText = paper.text(width / 2, height * 2 / 3 + 20, units);

            valueText.attr({
                "font-family": "arial",
                "font-size": "25",
                "font-weight": "bold",
                "fill": "#d3d4d4",
                "text-anchor": "middle"
            });

            unitsText.attr({
                "font-family": "arial",
                "font-size": "10",
                "font-weight": "normal",
                "fill": "#b3b3b3",
                "text-anchor": "middle"
            });

            // fill to 0 percent
            gaugeFill_Complete = paper.rect(width / 2 - gaugeWidth / 2, height / 3 - gaugeHeight / 2, 0, gaugeHeight);
			gaugeFill_Process = paper.rect(width / 2 - gaugeWidth / 2, height / 3 - gaugeHeight / 2, 0, gaugeHeight);
        }
        self.render = function (element) {
            $(element).append(titleElement.html(currentSettings.title)).append(gaugeElement);
            
            createGauge();
        }

        self.onSettingsChanged = function (newSettings) {
            if (newSettings.units != currentSettings.units || newSettings.min_value != currentSettings.min_value || newSettings.max_value != currentSettings.max_value) {
                currentSettings = newSettings;
                var units = _.isUndefined(currentSettings.units) ? "" : currentSettings.units;
                var min = _.isUndefined(currentSettings.min_value) ? 0 : currentSettings.min_value;
                var max = _.isUndefined(currentSettings.max_value) ? 0 : currentSettings.max_value;

                unitsText.attr({"text": units});
                minValueLabel.attr({"text": min});
                maxValueLabel.attr({"text": max});
            }
            else {
                currentSettings = newSettings;
            }

            titleElement.html(newSettings.title);
            createGauge();
        }

        self.onCalculatedValueChanged = function (settingName, newValue) {
			var process , complete ;
           if (settingName === "max_value") {
                if (!_.isUndefined(gaugeFill_Complete) && !_.isUndefined(maxValueLabel)) {
                    newValue = _.isUndefined(newValue) ? 0 : newValue;
                    maxValueLabel.attr({
                        "text" : newValue
                    });
                }
            }
            
            
            if (settingName === "complete_value") {
                if (!_.isUndefined(gaugeFill_Complete) && !_.isUndefined(valueText)) {
						complete = newValue;
						
                    });
                }
            }
            
		   if (settingName === "process_value") {
                if (!_.isUndefined(gaugeFill_Complete) && !_.isUndefined(valueText)) {
						process = newValue
                    });
                }
            }
			 valueText.attr({
			 "text" : process + "/" + complete });
			
			if (settingName === "percentage_complete") {
                if (!_.isUndefined(gaugeFill_Complete) && !_.isUndefined(valueText)) {

                    newValue = _.isUndefined(newValue) ? 0 : newValue;
					 var fillVal = 160 * newValue;
					 fillVal = fillVal > 160 ? 160 : fillVal;
					 fillVal = fillVal < 0 ? 0 : fillVal;
					 var fillColor = getColor(fillVal / 160);
					 gaugeFill_Complete.animate({"width": fillVal, "fill": fillColor, "stroke": fillColor}, 500, ">");

                }
            }
			
			if (settingName === "percentage_processed") {
                if (!_.isUndefined(gaugeFill_Process) && !_.isUndefined(valueText)) {

                    newValue = _.isUndefined(newValue) ? 0 : newValue;
					 var fillVal = 160 * newValue;
					 fillVal = fillVal > 160 ? 160 : fillVal;
					 fillVal = fillVal < 0 ? 0 : fillVal;
					 var fillColor = getColor(fillVal / 160);
					 gaugeFill_Process.animate({"width": fillVal, "fill": fillColor, "stroke": fillColor}, 500, ">");

                }
            }
        }

        self.onDispose = function () {
        }

        self.getHeight = function () {
            return 2;
        }

    };

    freeboard.loadWidgetPlugin({
        type_name: "horizontal-linear-gauge",
        display_name: "Horizontal Linear Gauge",
        "external_scripts" : [
            "plugins/thirdparty/raphael.2.1.0-custom.js",
            "plugins/thirdparty/colormix.2.0.0.min.js"
        ],
        settings: [
            {
                name: "title",
                display_name: "Title",
                type: "text"
            },
            {
                name: "complete_value",
                display_name: "Completed File Value",
                type: "calculated"
            },
			{
                name: "process_value",
                display_name: "Processed File Value",
                type: "calculated"
            },
            {
                name: "units",
                display_name: "Units",
                type: "text"
            },
            {
                name: "min_value",
                display_name: "Minimum",
                type: "number",
                default_value: 0
            },
            {
                name: "max_value",
                display_name: "Maximum",
                type: "calculated"
            },
            {
                name: "percentage_complete",
                display_name: "Complete Percentage",
                type: "calculated"
            },
			{
                name: "percentage_processed",
                display_name: "Processed Percentage",
                type: "calculated"
            
            }
        ],
        newInstance: function (settings, newInstanceCallback) {
            newInstanceCallback(new gaugeWidget(settings));
        }
    });
}());