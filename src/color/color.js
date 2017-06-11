/**
 *
 * This module provides routines for dealing with colors.
 *
 * @module dex/color
 *
 * @property {string[]} palette.c64Dark           - The commodore 64 dark palette.
 * @property {string[]} palette.c64Light          - The commodore 64 light palette.
 * @property {string[]} palette.divergingDark12   - Diverging dark colors.
 * @property {string[]} palette.divergingPastel12 - Diverging pastelles.
 * @property {string[]} palette.hueSoft128        - 128 colors with soft separation.
 * @property {string[]} palette.hueHard128        - 128 colors with hard separation.
 * @property {string[]} palette.crayola8          - The original 8 crayola colors.
 * @property {string[]} palette.crayola120        - 120 crayola colors.
 * @property {string[]} palette.YlGn              - Colorbrewer YlGn palettes 3-9.
 * @property {string[]} palette.YlGnBu            - Colorbrewer YlGnBu palettes 3-9.
 * @property {string[]} palette.GnBu              - Colorbrewer GnBu palettes 3-9.
 * @property {string[]} palette.BuGn              - Colorbrewer BuGn palettes 3-9.
 * @property {string[]} palette.PuBuGn            - Colorbrewer PuBuGn palettes 3-9.
 * @property {string[]} palette.PuBu              - Colorbrewer PuBu palettes 3-9.
 * @property {string[]} palette.BuPu              - Colorbrewer BuPu palettes 3-9.
 * @property {string[]} palette.RdPu              - Colorbrewer RdPu palettes 3-9.
 * @property {string[]} palette.PuRd              - Colorbrewer PuRd palettes 3-9.
 * @property {string[]} palette.OrRd              - Colorbrewer OrRd palettes 3-9.
 * @property {string[]} palette.YlOrRd            - Colorbrewer YlOrRd palettes 3-9.
 * @property {string[]} palette.YlOrBr            - Colorbrewer YlOrBr palettes 3-9.
 * @property {string[]} palette.Purples           - Colorbrewer Purples palettes 3-9.
 * @property {string[]} palette.Blues             - Colorbrewer Blues palettes 3-9.
 * @property {string[]} palette.Greens            - Colorbrewer Greens palettes 3-9.
 * @property {string[]} palette.Oranges           - Colorbrewer Oranges palettes 3-9.
 * @property {string[]} palette.Reds              - Colorbrewer Reds palettes 3-9.
 * @property {string[]} palette.Greys             - Colorbrewer Greys palettes 3-9.
 * @property {string[]} palette.PuOr              - Colorbrewer PuOr palettes 3-11.
 * @property {string[]} palette.BrBG              - Colorbrewer BrBG palettes 3-11.
 * @property {string[]} palette.PRGn              - Colorbrewer PRGn palettes 3-11.
 * @property {string[]} palette.PiYG              - Colorbrewer PiYG palettes 3-11.
 * @property {string[]} palette.RdBu              - Colorbrewer RdBu palettes 3-11.
 * @property {string[]} palette.RdGy              - Colorbrewer RdGy palettes 3-11.
 * @property {string[]} palette.RdYlBu            - Colorbrewer RdYlBu palettes 3-11.
 * @property {string[]} palette.Spectral          - Colorbrewer Spectral palettes 3-11.
 * @property {string[]} palette.RdYlGn            - Colorbrewer RdYlGn palettes 3-11.
 * @property {string[]} palette.Accent            - Colorbrewer Accent palettes 3-8.
 * @property {string[]} palette.Dark2             - Colorbrewer Dark2 palettes 3-8.
 * @property {string[]} palette.Paired            - Colorbrewer Paired palettes 3-12.
 * @property {string[]} palette.Pastel1           - Colorbrewer Pastel1 palettes 3-9.
 * @property {string[]} palette.Pastel2           - Colorbrewer Pastel2 palettes 3-8.
 * @property {string[]} palette.Set1              - Colorbrewer Set1 palettes 3-9.
 * @property {string[]} palette.Set2              - Colorbrewer Set2 palettes 3-8.
 * @property {string[]} palette.Set3              - Colorbrewer Set3 palettes 3-12.
 *
 */

module.exports = function color(dex) {

  return {
    /**
     *
     * Given a color, lighten or darken it by the requested percent.
     *
     * @param {string} color The color to modify.
     * @param {number} percent A floating point number in the range of [-1.0, 1.0].  Negative
     * values will lighten the color, positive values will darken it.
     *
     * @returns {string} The lightened or darkened color in the form of #ffffff.
     *
     */
    'shadeColor': function (color, percent) {
      var f = parseInt(color.slice(1), 16), t = percent < 0 ? 0 : 255,
        p = percent < 0 ? percent * -1 : percent,
        R = f >> 16, G = f >> 8 & 0x00FF, B = f & 0x0000FF;
      return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) *
        0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
    },

    /**
     *
     * Given two colors, blend them together.
     *
     * @param color1
     * @param color2
     * @param percent
     * @returns {string}
     *
     */
    'blendColors': function (color1, color2, percent) {
      var f = parseInt(color1.slice(1), 16), t = parseInt(color2.slice(1), 16),
        R1 = f >> 16, G1 = f >> 8 & 0x00FF,
        B1 = f & 0x0000FF, R2 = t >> 16,
        G2 = t >> 8 & 0x00FF, B2 = t & 0x0000FF;

      return "#" + (0x1000000 + (Math.round((R2 - R1) * percent) + R1) * 0x10000 +
        (Math.round((G2 - G1) * percent) + G1) * 0x100 +
        (Math.round((B2 - B1) * percent) + B1)).toString(16).slice(1);
    },
    /**
     *
     * Given an palette or array of colors and some optional color
     * assignmeents, create a colormap.
     *
     * @param {string[]} palette An array of colors within this colormap.
     * @param {object} presets An optional mapping of domain values and
     * preset color assignments.
     *
     * @returns {Function} Returns the colormap function.
     *
     * @example
     * // Assigns a colormap of red, white and blue
     * var usColormap = dex.color.colormap(['red', 'white', 'blue']);
     * @example
     * // Assigns a colormap of grey, brown and yellow and reserves red for
     * // Republicans and blue for Democrats.
     * var usPartyColors = dex.color.colormap(['grey', 'brown', 'yellow'],
     *   { 'Republican' : 'red', 'Democrat' : 'blue' });
     *
     */
    'colormap': function (palette, presets) {
      var numColors = palette.length;
      var data2Color = presets || {};
      var currentColor = 0;

      return function (d) {
        if (data2Color[d]) {
          //dex.console.log("Existing Color: " + d + " = " + data2Color[d]);
          return data2Color[d];
        }
        else {
          data2Color[d] = palette[currentColor % numColors];
          //dex.console.log("New Color[" + currentColor + "]: " + d + " = " + data2Color[d]);
          currentColor++;
          return data2Color[d];
        }
      };
    },
    /**
     *
     * Return the list of available named colormaps.
     *
     * @return {string[]} The list of available colormaps.
     *
     */
    'colormaps': function (options) {
      var opts = options || {};
      if (opts.shortlist) {
        return [
          "category10", "category20b", "category20c", "category20", "c64Dark",
          "c64Light", "divergingDark12", "divergingPastel12", "hueSoft128",
          "hueHard128", "crayola8", "crayola120", "YlGn_9",
          "YlGnBu_9", "GnBu_9", "BuGn_9", "PuBuGn_9", "PuBu_9",
          "BuPu_9", "RdPu_9", "PuRd_9", "OrRd_9", "YlOrRd_9", "YlOrBr_9",
          "Purples_9", "Blues_9", "Greens_9", "Oranges_9", "Reds_9",
          "Greys_9", "PuOr_11", "BrBG_11", "PRGn_11", "PiYG_11",
          "RdBu_11", "RdGy_11", "RdYlBu_11",
          "Spectral_4", "Spectral_8", "Spectral_11",
          "RdYlGn_11", "Accent_8", "Dark2_8", "Paired_12",
          "Pastel1_9", "Pastel2_8", "Set1_9", "Set2_8", "Set3_12"
        ];
      }
      return Object.keys(dex.color.palette);
    },

    /**
     *
     * Given a domain of 2 or more items and a range of 2 colors,
     * return a categorical interpolation across the two colors
     * based upon the supplied range.
     *
     * @param {string[]} domain 2 or more items in a categorical domain.
     * @param {string[]} range An array of 2 colors.
     * @returns {Function} A colormap function.
     *
     */
    'interpolateCategorical': function (domain, range) {
      var color = d3.scale.ordinal()
        .domain(domain)
        .range(d3.range(domain.length).map(d3.scale.linear()
          .domain([0, domain.length - 1])
          .range(range)
          .interpolate(d3.interpolateLab)));

      return function (d) {
        return color(d);
      };
    },
    /**
     *
     * Get the named colormap with the assigned presets.
     *
     * @param paletteName The name of the color palette to be used.
     * @param presets Optional user defined color presets which are
     * assigned via categorial domain.
     *
     * @returns {Function} The colormap function.
     *
     */
    'getColormap': function (paletteName, presets) {
      var colormap = dex.color.colormap(dex.color.palette[paletteName], presets);
      return function (d) {
        return colormap(d);
      };
    },
    'palette': {
      'category10': [
        '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
        '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
      ],
      'category20b': [
        '#393b79', '#5254a3', '#6b6ecf', '#9c9ede', '#637939',
        '#8ca252', '#b5cf6b', '#cedb9c', '#8c6d31', '#bd9e39',
        '#e7ba52', '#e7cb94', '#843c39', '#ad494a', '#d6616b',
        '#e7969c', '#7b4173', '#a55194', '#ce6dbd', '#de9ed6'
      ],
      'category20c': [
        '#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#e6550d',
        '#fd8d3c', '#fdae6b', '#fdd0a2', '#31a354', '#74c476',
        '#a1d99b', '#c7e9c0', '#756bb1', '#9e9ac8', '#bcbddc',
        '#dadaeb', '#636363', '#969696', '#bdbdbd', '#d9d9d9'
      ],
      'category20': [
        '#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c',
        '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5',
        '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f',
        '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'
      ],
      'c64Dark': [
        '#000000', '#880000', '#AAFFEE', '#CC44CC', '#00CC55',
        '#0000AA', '#EEEE77', '#DD8855', '#664400', '#FF7777',
        '#333333', '#777777', '#AAFF66', '#0088FF', '#BBBBBB'
      ],
      'c64Light': [
        '#FFFFFF', '#880000', '#AAFFEE', '#CC44CC', '#00CC55',
        '#0000AA', '#EEEE77', '#DD8855', '#664400', '#FF7777',
        '#333333', '#777777', '#AAFF66', '#0088FF', '#BBBBBB'
      ],
      'divergingDark12': [
        '#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99',
        '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a',
        '#ffff99', '#b15928'],
      'divergingPastel12': [
        '#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3',
        '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd',
        '#ccebc5', '#ffed6f'],
      'hueSoft128': [
        "#62a96c", "#9844ed", "#37b335", "#6334ce", "#6cac16",
        "#3c4ce7", "#5e9222", "#6d19b6", "#66b450", "#b229cc",
        "#348f2d", "#de50ee", "#23af6d", "#e72fc2", "#8ea42f",
        "#2d2bb8", "#ae9620", "#7a62f3", "#d5942b", "#3c52d6",
        "#e47b24", "#542da9", "#84a953", "#a35de9", "#768930",
        "#a047c8", "#2d8346", "#f128a4", "#558338", "#d75eda",
        "#355f17", "#9d229f", "#9f8d30", "#534bbf", "#ed5322",
        "#4483f2", "#dc312d", "#5d70e7", "#ad7523", "#a272e8",
        "#6c6e1a", "#68208f", "#ada257", "#26439f", "#ba3a1e",
        "#4397dd", "#e72754", "#48a9a2", "#ed2f74", "#3d8d67",
        "#e75abe", "#305d3b", "#b82891", "#86a46f", "#7c41a4",
        "#d28047", "#5556b3", "#b0531f", "#6a8fe0", "#8d2f0d",
        "#3ba8c4", "#ce3f4c", "#3783a3", "#e97059", "#3e69b6",
        "#a18447", "#ba71d5", "#4d4f22", "#bc4eae", "#6ba385",
        "#df3d80", "#43857c", "#eb57a1", "#1c5b5a", "#be297b",
        "#6d7d4c", "#837edd", "#805f27", "#b38ad8", "#704117",
        "#9f95db", "#94292c", "#70a2c7", "#b52c58", "#48706b",
        "#ee6b99", "#344b46", "#e56177", "#376093", "#c36758",
        "#31477e", "#bb8965", "#554286", "#a19b6f", "#6f1f6a",
        "#7b9587", "#8f3888", "#505a47", "#cd7ec9", "#6e6246",
        "#ab579c", "#55412f", "#dd79b2", "#305061", "#c05081",
        "#7f98a6", "#982256", "#506c7f", "#793626", "#6e82b0",
        "#7f3441", "#7e64a9", "#845941", "#7d2453", "#af9992",
        "#80416f", "#847063", "#a76794", "#434460", "#ce8d8f",
        "#603d63", "#d17b92", "#623e43", "#a58bad", "#a16460",
        "#746687", "#a45269", "#886574"],
      'hueHard128': [
        "#74b6b1", "#5500bb", "#47c323", "#9a2bdf", "#47a100",
        "#1d1ab7", "#00a646", "#d629e2", "#79bc4c", "#d34fff",
        "#8d9c00", "#a253ff", "#5a7c00", "#ff3cde", "#176100",
        "#c100b2", "#007533", "#f400a3", "#54be82", "#5c0392",
        "#e39800", "#005ae1", "#ff8902", "#3685ff", "#fc6900",
        "#00329f", "#cea635", "#986fff", "#a18600", "#c872ff",
        "#777800", "#6d7dff", "#dca036", "#0048a4", "#ed001d",
        "#02b1f9", "#ba0000", "#55aeff", "#d03e00", "#649aff",
        "#ca5a00", "#0061c1", "#f49339", "#472881", "#93b65a",
        "#b5009a", "#017745", "#ff52ca", "#335500", "#fd77f6",
        "#009377", "#d20096", "#00babf", "#dc003d", "#00a9a5",
        "#ff3a5d", "#37b9d7", "#e10058", "#017c7b", "#ff5a4b",
        "#018dd1", "#c36c00", "#9d95ff", "#9e6f00", "#de89fe",
        "#7c5c00", "#73007f", "#bdab5a", "#ff64c6", "#0e4527",
        "#cf0069", "#77b899", "#c50070", "#005c48", "#ff6199",
        "#017690", "#a20016", "#5eb3ec", "#882300", "#016bb8",
        "#ff8557", "#153a73", "#f69158", "#004875", "#ff5f63",
        "#0088b6", "#ff7962", "#016291", "#d5a255", "#6e0e5d",
        "#a2b177", "#91005c", "#b2ac87", "#ac004f", "#005264",
        "#ff5f84", "#353e31", "#de8ee6", "#5a4a00", "#bf9af1",
        "#834700", "#98aada", "#7a0c0b", "#90aec8", "#900036",
        "#abad94", "#433268", "#d4a16d", "#2f3a5d", "#ff6d7b",
        "#433c10", "#e48ed2", "#523609", "#f887b5", "#483a20",
        "#f68aa5", "#44364f", "#e89770", "#5f284c", "#b0aaa6",
        "#6e1f29", "#c1a0c8", "#652a13", "#c7a0b3", "#4d3636",
        "#fa8b8e", "#582f3e", "#df989e"
      ],
      'crayola8': [
        'red', 'yellow', 'blue', 'green',
        'orange', 'brown', 'violet', 'black'],
      'crayola120': [
        '#EFDBC5', '#CD9575', '#FDD9B5', '#78DBE2',
        '#87A96B', '#FFA474', '#FAE7B5', '#9F8170',
        '#FD7C6E', '#232323', '#1F75FE', '#ADADD6',
        '#199EBD', '#7366BD', '#DE5D83', '#CB4154',
        '#B4674D', '#FF7F49', '#EA7E5D', '#B0B7C6',
        '#FFFF99', '#1CD3A2', '#FFAACC', '#DD4492',
        '#1DACD6', '#BC5D58', '#DD9475', '#9ACEEB',
        '#FFBCD9', '#FDDB6D', '#2B6CC4', '#EFCDB8',
        '#6E5160', '#1DF914', '#71BC78', '#6DAE81',
        '#C364C5', '#CC6666', '#E7C697', '#FCD975',
        '#A8E4A0', '#95918C', '#1CAC78', '#F0E891',
        '#FF1DCE', '#B2EC5D', '#5D76CB', '#CA3767',
        '#3BB08F', '#FDFC74', '#FCB4D5', '#FFBD88',
        '#F664AF', '#CD4A4A', '#979AAA', '#FF8243',
        '#C8385A', '#EF98AA', '#FDBCB4', '#1A4876',
        '#30BA8F', '#1974D2', '#FFA343', '#BAB86C',
        '#FF7538', '#E6A8D7', '#414A4C', '#FF6E4A',
        '#1CA9C9', '#FFCFAB', '#C5D0E6', '#FDD7E4',
        '#158078', '#FC74FD', '#F780A1', '#8E4585',
        '#7442C8', '#9D81BA', '#FF1DCE', '#FF496C',
        '#D68A59', '#FF48D0', '#E3256B', '#EE204D',
        '#FF5349', '#C0448F', '#1FCECB', '#7851A9',
        '#FF9BAA', '#FC2847', '#76FF7A', '#9FE2BF',
        '#A5694F', '#8A795D', '#45CEA2', '#FB7EFD',
        '#CDC5C2', '#80DAEB', '#ECEABE', '#FFCF48',
        '#FD5E53', '#FAA76C', '#FC89AC', '#DBD7D2',
        '#17806D', '#DEAA88', '#77DDE7', '#FDFC74',
        '#926EAE', '#F75394', '#FFA089', '#8F509D',
        '#EDEDED', '#A2ADD0', '#FF43A4', '#FC6C85',
        '#CDA4DE', '#FCE883', '#C5E384', '#FFB653'
      ],
      "YlGn_3": ["#f7fcb9", "#addd8e", "#31a354"],
      "YlGn_4": ["#ffffcc", "#c2e699", "#78c679", "#238443"],
      "YlGn_5": ["#ffffcc", "#c2e699", "#78c679", "#31a354", "#006837"],
      "YlGn_6": ["#ffffcc", "#d9f0a3", "#addd8e", "#78c679", "#31a354", "#006837"],
      "YlGn_7": ["#ffffcc", "#d9f0a3", "#addd8e", "#78c679", "#41ab5d", "#238443", "#005a32"],
      "YlGn_8": ["#ffffe5", "#f7fcb9", "#d9f0a3", "#addd8e", "#78c679", "#41ab5d", "#238443", "#005a32"],
      "YlGn_9": ["#ffffe5", "#f7fcb9", "#d9f0a3", "#addd8e", "#78c679", "#41ab5d", "#238443", "#006837", "#004529"],
      "YlGnBu_3": ["#edf8b1", "#7fcdbb", "#2c7fb8"],
      "YlGnBu_4": ["#ffffcc", "#a1dab4", "#41b6c4", "#225ea8"],
      "YlGnBu_5": ["#ffffcc", "#a1dab4", "#41b6c4", "#2c7fb8", "#253494"],
      "YlGnBu_6": ["#ffffcc", "#c7e9b4", "#7fcdbb", "#41b6c4", "#2c7fb8", "#253494"],
      "YlGnBu_7": ["#ffffcc", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#0c2c84"],
      "YlGnBu_8": ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#0c2c84"],
      "YlGnBu_9": ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494", "#081d58"],
      "GnBu_3": ["#e0f3db", "#a8ddb5", "#43a2ca"],
      "GnBu_4": ["#f0f9e8", "#bae4bc", "#7bccc4", "#2b8cbe"],
      "GnBu_5": ["#f0f9e8", "#bae4bc", "#7bccc4", "#43a2ca", "#0868ac"],
      "GnBu_6": ["#f0f9e8", "#ccebc5", "#a8ddb5", "#7bccc4", "#43a2ca", "#0868ac"],
      "GnBu_7": ["#f0f9e8", "#ccebc5", "#a8ddb5", "#7bccc4", "#4eb3d3", "#2b8cbe", "#08589e"],
      "GnBu_8": ["#f7fcf0", "#e0f3db", "#ccebc5", "#a8ddb5", "#7bccc4", "#4eb3d3", "#2b8cbe", "#08589e"],
      "GnBu_9": ["#f7fcf0", "#e0f3db", "#ccebc5", "#a8ddb5", "#7bccc4", "#4eb3d3", "#2b8cbe", "#0868ac", "#084081"],
      "BuGn_3": ["#e5f5f9", "#99d8c9", "#2ca25f"],
      "BuGn_4": ["#edf8fb", "#b2e2e2", "#66c2a4", "#238b45"],
      "BuGn_5": ["#edf8fb", "#b2e2e2", "#66c2a4", "#2ca25f", "#006d2c"],
      "BuGn_6": ["#edf8fb", "#ccece6", "#99d8c9", "#66c2a4", "#2ca25f", "#006d2c"],
      "BuGn_7": ["#edf8fb", "#ccece6", "#99d8c9", "#66c2a4", "#41ae76", "#238b45", "#005824"],
      "BuGn_8": ["#f7fcfd", "#e5f5f9", "#ccece6", "#99d8c9", "#66c2a4", "#41ae76", "#238b45", "#005824"],
      "BuGn_9": ["#f7fcfd", "#e5f5f9", "#ccece6", "#99d8c9", "#66c2a4", "#41ae76", "#238b45", "#006d2c", "#00441b"],
      "PuBuGn_3": ["#ece2f0", "#a6bddb", "#1c9099"],
      "PuBuGn_4": ["#f6eff7", "#bdc9e1", "#67a9cf", "#02818a"],
      "PuBuGn_5": ["#f6eff7", "#bdc9e1", "#67a9cf", "#1c9099", "#016c59"],
      "PuBuGn_6": ["#f6eff7", "#d0d1e6", "#a6bddb", "#67a9cf", "#1c9099", "#016c59"],
      "PuBuGn_7": ["#f6eff7", "#d0d1e6", "#a6bddb", "#67a9cf", "#3690c0", "#02818a", "#016450"],
      "PuBuGn_8": ["#fff7fb", "#ece2f0", "#d0d1e6", "#a6bddb", "#67a9cf", "#3690c0", "#02818a", "#016450"],
      "PuBuGn_9": ["#fff7fb", "#ece2f0", "#d0d1e6", "#a6bddb", "#67a9cf", "#3690c0", "#02818a", "#016c59", "#014636"],
      "PuBu_3": ["#ece7f2", "#a6bddb", "#2b8cbe"],
      "PuBu_4": ["#f1eef6", "#bdc9e1", "#74a9cf", "#0570b0"],
      "PuBu_5": ["#f1eef6", "#bdc9e1", "#74a9cf", "#2b8cbe", "#045a8d"],
      "PuBu_6": ["#f1eef6", "#d0d1e6", "#a6bddb", "#74a9cf", "#2b8cbe", "#045a8d"],
      "PuBu_7": ["#f1eef6", "#d0d1e6", "#a6bddb", "#74a9cf", "#3690c0", "#0570b0", "#034e7b"],
      "PuBu_8": ["#fff7fb", "#ece7f2", "#d0d1e6", "#a6bddb", "#74a9cf", "#3690c0", "#0570b0", "#034e7b"],
      "PuBu_9": ["#fff7fb", "#ece7f2", "#d0d1e6", "#a6bddb", "#74a9cf", "#3690c0", "#0570b0", "#045a8d", "#023858"],
      "BuPu_3": ["#e0ecf4", "#9ebcda", "#8856a7"],
      "BuPu_4": ["#edf8fb", "#b3cde3", "#8c96c6", "#88419d"],
      "BuPu_5": ["#edf8fb", "#b3cde3", "#8c96c6", "#8856a7", "#810f7c"],
      "BuPu_6": ["#edf8fb", "#bfd3e6", "#9ebcda", "#8c96c6", "#8856a7", "#810f7c"],
      "BuPu_7": ["#edf8fb", "#bfd3e6", "#9ebcda", "#8c96c6", "#8c6bb1", "#88419d", "#6e016b"],
      "BuPu_8": ["#f7fcfd", "#e0ecf4", "#bfd3e6", "#9ebcda", "#8c96c6", "#8c6bb1", "#88419d", "#6e016b"],
      "BuPu_9": ["#f7fcfd", "#e0ecf4", "#bfd3e6", "#9ebcda", "#8c96c6", "#8c6bb1", "#88419d", "#810f7c", "#4d004b"],
      "RdPu_3": ["#fde0dd", "#fa9fb5", "#c51b8a"],
      "RdPu_4": ["#feebe2", "#fbb4b9", "#f768a1", "#ae017e"],
      "RdPu_5": ["#feebe2", "#fbb4b9", "#f768a1", "#c51b8a", "#7a0177"],
      "RdPu_6": ["#feebe2", "#fcc5c0", "#fa9fb5", "#f768a1", "#c51b8a", "#7a0177"],
      "RdPu_7": ["#feebe2", "#fcc5c0", "#fa9fb5", "#f768a1", "#dd3497", "#ae017e", "#7a0177"],
      "RdPu_8": ["#fff7f3", "#fde0dd", "#fcc5c0", "#fa9fb5", "#f768a1", "#dd3497", "#ae017e", "#7a0177"],
      "RdPu_9": ["#fff7f3", "#fde0dd", "#fcc5c0", "#fa9fb5", "#f768a1", "#dd3497", "#ae017e", "#7a0177", "#49006a"],
      "PuRd_3": ["#e7e1ef", "#c994c7", "#dd1c77"],
      "PuRd_4": ["#f1eef6", "#d7b5d8", "#df65b0", "#ce1256"],
      "PuRd_5": ["#f1eef6", "#d7b5d8", "#df65b0", "#dd1c77", "#980043"],
      "PuRd_6": ["#f1eef6", "#d4b9da", "#c994c7", "#df65b0", "#dd1c77", "#980043"],
      "PuRd_7": ["#f1eef6", "#d4b9da", "#c994c7", "#df65b0", "#e7298a", "#ce1256", "#91003f"],
      "PuRd_8": ["#f7f4f9", "#e7e1ef", "#d4b9da", "#c994c7", "#df65b0", "#e7298a", "#ce1256", "#91003f"],
      "PuRd_9": ["#f7f4f9", "#e7e1ef", "#d4b9da", "#c994c7", "#df65b0", "#e7298a", "#ce1256", "#980043", "#67001f"],
      "OrRd_3": ["#fee8c8", "#fdbb84", "#e34a33"],
      "OrRd_4": ["#fef0d9", "#fdcc8a", "#fc8d59", "#d7301f"],
      "OrRd_5": ["#fef0d9", "#fdcc8a", "#fc8d59", "#e34a33", "#b30000"],
      "OrRd_6": ["#fef0d9", "#fdd49e", "#fdbb84", "#fc8d59", "#e34a33", "#b30000"],
      "OrRd_7": ["#fef0d9", "#fdd49e", "#fdbb84", "#fc8d59", "#ef6548", "#d7301f", "#990000"],
      "OrRd_8": ["#fff7ec", "#fee8c8", "#fdd49e", "#fdbb84", "#fc8d59", "#ef6548", "#d7301f", "#990000"],
      "OrRd_9": ["#fff7ec", "#fee8c8", "#fdd49e", "#fdbb84", "#fc8d59", "#ef6548", "#d7301f", "#b30000", "#7f0000"],
      "YlOrRd_3": ["#ffeda0", "#feb24c", "#f03b20"],
      "YlOrRd_4": ["#ffffb2", "#fecc5c", "#fd8d3c", "#e31a1c"],
      "YlOrRd_5": ["#ffffb2", "#fecc5c", "#fd8d3c", "#f03b20", "#bd0026"],
      "YlOrRd_6": ["#ffffb2", "#fed976", "#feb24c", "#fd8d3c", "#f03b20", "#bd0026"],
      "YlOrRd_7": ["#ffffb2", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#b10026"],
      "YlOrRd_8": ["#ffffcc", "#ffeda0", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#b10026"],
      "YlOrRd_9": ["#ffffcc", "#ffeda0", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#bd0026", "#800026"],
      "YlOrBr_3": ["#fff7bc", "#fec44f", "#d95f0e"],
      "YlOrBr_4": ["#ffffd4", "#fed98e", "#fe9929", "#cc4c02"],
      "YlOrBr_5": ["#ffffd4", "#fed98e", "#fe9929", "#d95f0e", "#993404"],
      "YlOrBr_6": ["#ffffd4", "#fee391", "#fec44f", "#fe9929", "#d95f0e", "#993404"],
      "YlOrBr_7": ["#ffffd4", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#8c2d04"],
      "YlOrBr_8": ["#ffffe5", "#fff7bc", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#8c2d04"],
      "YlOrBr_9": ["#ffffe5", "#fff7bc", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#993404", "#662506"],
      "Purples_3": ["#efedf5", "#bcbddc", "#756bb1"],
      "Purples_4": ["#f2f0f7", "#cbc9e2", "#9e9ac8", "#6a51a3"],
      "Purples_5": ["#f2f0f7", "#cbc9e2", "#9e9ac8", "#756bb1", "#54278f"],
      "Purples_6": ["#f2f0f7", "#dadaeb", "#bcbddc", "#9e9ac8", "#756bb1", "#54278f"],
      "Purples_7": ["#f2f0f7", "#dadaeb", "#bcbddc", "#9e9ac8", "#807dba", "#6a51a3", "#4a1486"],
      "Purples_8": ["#fcfbfd", "#efedf5", "#dadaeb", "#bcbddc", "#9e9ac8", "#807dba", "#6a51a3", "#4a1486"],
      "Purples_9": ["#fcfbfd", "#efedf5", "#dadaeb", "#bcbddc", "#9e9ac8", "#807dba", "#6a51a3", "#54278f", "#3f007d"],
      "Blues_3": ["#deebf7", "#9ecae1", "#3182bd"],
      "Blues_4": ["#eff3ff", "#bdd7e7", "#6baed6", "#2171b5"],
      "Blues_5": ["#eff3ff", "#bdd7e7", "#6baed6", "#3182bd", "#08519c"],
      "Blues_6": ["#eff3ff", "#c6dbef", "#9ecae1", "#6baed6", "#3182bd", "#08519c"],
      "Blues_7": ["#eff3ff", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#084594"],
      "Blues_8": ["#f7fbff", "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#084594"],
      "Blues_9": ["#f7fbff", "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#08519c", "#08306b"],
      "Greens_3": ["#e5f5e0", "#a1d99b", "#31a354"],
      "Greens_4": ["#edf8e9", "#bae4b3", "#74c476", "#238b45"],
      "Greens_5": ["#edf8e9", "#bae4b3", "#74c476", "#31a354", "#006d2c"],
      "Greens_6": ["#edf8e9", "#c7e9c0", "#a1d99b", "#74c476", "#31a354", "#006d2c"],
      "Greens_7": ["#edf8e9", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#005a32"],
      "Greens_8": ["#f7fcf5", "#e5f5e0", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#005a32"],
      "Greens_9": ["#f7fcf5", "#e5f5e0", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#006d2c", "#00441b"],
      "Oranges_3": ["#fee6ce", "#fdae6b", "#e6550d"],
      "Oranges_4": ["#feedde", "#fdbe85", "#fd8d3c", "#d94701"],
      "Oranges_5": ["#feedde", "#fdbe85", "#fd8d3c", "#e6550d", "#a63603"],
      "Oranges_6": ["#feedde", "#fdd0a2", "#fdae6b", "#fd8d3c", "#e6550d", "#a63603"],
      "Oranges_7": ["#feedde", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#8c2d04"],
      "Oranges_8": ["#fff5eb", "#fee6ce", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#8c2d04"],
      "Oranges_9": ["#fff5eb", "#fee6ce", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#a63603", "#7f2704"],
      "Reds_3": ["#fee0d2", "#fc9272", "#de2d26"],
      "Reds_4": ["#fee5d9", "#fcae91", "#fb6a4a", "#cb181d"],
      "Reds_5": ["#fee5d9", "#fcae91", "#fb6a4a", "#de2d26", "#a50f15"],
      "Reds_6": ["#fee5d9", "#fcbba1", "#fc9272", "#fb6a4a", "#de2d26", "#a50f15"],
      "Reds_7": ["#fee5d9", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#99000d"],
      "Reds_8": ["#fff5f0", "#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#99000d"],
      "Reds_9": ["#fff5f0", "#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#a50f15", "#67000d"],
      "Greys_3": ["#f0f0f0", "#bdbdbd", "#636363"],
      "Greys_4": ["#f7f7f7", "#cccccc", "#969696", "#525252"],
      "Greys_5": ["#f7f7f7", "#cccccc", "#969696", "#636363", "#252525"],
      "Greys_6": ["#f7f7f7", "#d9d9d9", "#bdbdbd", "#969696", "#636363", "#252525"],
      "Greys_7": ["#f7f7f7", "#d9d9d9", "#bdbdbd", "#969696", "#737373", "#525252", "#252525"],
      "Greys_8": ["#ffffff", "#f0f0f0", "#d9d9d9", "#bdbdbd", "#969696", "#737373", "#525252", "#252525"],
      "Greys_9": ["#ffffff", "#f0f0f0", "#d9d9d9", "#bdbdbd", "#969696", "#737373", "#525252", "#252525", "#000000"],
      "PuOr_3": ["#f1a340", "#f7f7f7", "#998ec3"],
      "PuOr_4": ["#e66101", "#fdb863", "#b2abd2", "#5e3c99"],
      "PuOr_5": ["#e66101", "#fdb863", "#f7f7f7", "#b2abd2", "#5e3c99"],
      "PuOr_6": ["#b35806", "#f1a340", "#fee0b6", "#d8daeb", "#998ec3", "#542788"],
      "PuOr_7": ["#b35806", "#f1a340", "#fee0b6", "#f7f7f7", "#d8daeb", "#998ec3", "#542788"],
      "PuOr_8": ["#b35806", "#e08214", "#fdb863", "#fee0b6", "#d8daeb", "#b2abd2", "#8073ac", "#542788"],
      "PuOr_9": ["#b35806", "#e08214", "#fdb863", "#fee0b6", "#f7f7f7", "#d8daeb", "#b2abd2", "#8073ac", "#542788"],
      "PuOr_10": ["#7f3b08", "#b35806", "#e08214", "#fdb863", "#fee0b6", "#d8daeb", "#b2abd2", "#8073ac", "#542788", "#2d004b"],
      "PuOr_11": ["#7f3b08", "#b35806", "#e08214", "#fdb863", "#fee0b6", "#f7f7f7", "#d8daeb", "#b2abd2", "#8073ac", "#542788", "#2d004b"],
      "BrBG_3": ["#d8b365", "#f5f5f5", "#5ab4ac"],
      "BrBG_4": ["#a6611a", "#dfc27d", "#80cdc1", "#018571"],
      "BrBG_5": ["#a6611a", "#dfc27d", "#f5f5f5", "#80cdc1", "#018571"],
      "BrBG_6": ["#8c510a", "#d8b365", "#f6e8c3", "#c7eae5", "#5ab4ac", "#01665e"],
      "BrBG_7": ["#8c510a", "#d8b365", "#f6e8c3", "#f5f5f5", "#c7eae5", "#5ab4ac", "#01665e"],
      "BrBG_8": ["#8c510a", "#bf812d", "#dfc27d", "#f6e8c3", "#c7eae5", "#80cdc1", "#35978f", "#01665e"],
      "BrBG_9": ["#8c510a", "#bf812d", "#dfc27d", "#f6e8c3", "#f5f5f5", "#c7eae5", "#80cdc1", "#35978f", "#01665e"],
      "BrBG_10": ["#543005", "#8c510a", "#bf812d", "#dfc27d", "#f6e8c3", "#c7eae5", "#80cdc1", "#35978f", "#01665e", "#003c30"],
      "BrBG_11": ["#543005", "#8c510a", "#bf812d", "#dfc27d", "#f6e8c3", "#f5f5f5", "#c7eae5", "#80cdc1", "#35978f", "#01665e", "#003c30"],
      "PRGn_3": ["#af8dc3", "#f7f7f7", "#7fbf7b"],
      "PRGn_4": ["#7b3294", "#c2a5cf", "#a6dba0", "#008837"],
      "PRGn_5": ["#7b3294", "#c2a5cf", "#f7f7f7", "#a6dba0", "#008837"],
      "PRGn_6": ["#762a83", "#af8dc3", "#e7d4e8", "#d9f0d3", "#7fbf7b", "#1b7837"],
      "PRGn_7": ["#762a83", "#af8dc3", "#e7d4e8", "#f7f7f7", "#d9f0d3", "#7fbf7b", "#1b7837"],
      "PRGn_8": ["#762a83", "#9970ab", "#c2a5cf", "#e7d4e8", "#d9f0d3", "#a6dba0", "#5aae61", "#1b7837"],
      "PRGn_9": ["#762a83", "#9970ab", "#c2a5cf", "#e7d4e8", "#f7f7f7", "#d9f0d3", "#a6dba0", "#5aae61", "#1b7837"],
      "PRGn_10": ["#40004b", "#762a83", "#9970ab", "#c2a5cf", "#e7d4e8", "#d9f0d3", "#a6dba0", "#5aae61", "#1b7837", "#00441b"],
      "PRGn_11": ["#40004b", "#762a83", "#9970ab", "#c2a5cf", "#e7d4e8", "#f7f7f7", "#d9f0d3", "#a6dba0", "#5aae61", "#1b7837", "#00441b"],
      "PiYG_3": ["#e9a3c9", "#f7f7f7", "#a1d76a"],
      "PiYG_4": ["#d01c8b", "#f1b6da", "#b8e186", "#4dac26"],
      "PiYG_5": ["#d01c8b", "#f1b6da", "#f7f7f7", "#b8e186", "#4dac26"],
      "PiYG_6": ["#c51b7d", "#e9a3c9", "#fde0ef", "#e6f5d0", "#a1d76a", "#4d9221"],
      "PiYG_7": ["#c51b7d", "#e9a3c9", "#fde0ef", "#f7f7f7", "#e6f5d0", "#a1d76a", "#4d9221"],
      "PiYG_8": ["#c51b7d", "#de77ae", "#f1b6da", "#fde0ef", "#e6f5d0", "#b8e186", "#7fbc41", "#4d9221"],
      "PiYG_9": ["#c51b7d", "#de77ae", "#f1b6da", "#fde0ef", "#f7f7f7", "#e6f5d0", "#b8e186", "#7fbc41", "#4d9221"],
      "PiYG_10": ["#8e0152", "#c51b7d", "#de77ae", "#f1b6da", "#fde0ef", "#e6f5d0", "#b8e186", "#7fbc41", "#4d9221", "#276419"],
      "PiYG_11": ["#8e0152", "#c51b7d", "#de77ae", "#f1b6da", "#fde0ef", "#f7f7f7", "#e6f5d0", "#b8e186", "#7fbc41", "#4d9221", "#276419"],
      "RdBu_3": ["#ef8a62", "#f7f7f7", "#67a9cf"],
      "RdBu_4": ["#ca0020", "#f4a582", "#92c5de", "#0571b0"],
      "RdBu_5": ["#ca0020", "#f4a582", "#f7f7f7", "#92c5de", "#0571b0"],
      "RdBu_6": ["#b2182b", "#ef8a62", "#fddbc7", "#d1e5f0", "#67a9cf", "#2166ac"],
      "RdBu_7": ["#b2182b", "#ef8a62", "#fddbc7", "#f7f7f7", "#d1e5f0", "#67a9cf", "#2166ac"],
      "RdBu_8": ["#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac"],
      "RdBu_9": ["#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#f7f7f7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac"],
      "RdBu_10": ["#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac", "#053061"],
      "RdBu_11": ["#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#f7f7f7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac", "#053061"],
      "RdGy_3": ["#ef8a62", "#ffffff", "#999999"],
      "RdGy_4": ["#ca0020", "#f4a582", "#bababa", "#404040"],
      "RdGy_5": ["#ca0020", "#f4a582", "#ffffff", "#bababa", "#404040"],
      "RdGy_6": ["#b2182b", "#ef8a62", "#fddbc7", "#e0e0e0", "#999999", "#4d4d4d"],
      "RdGy_7": ["#b2182b", "#ef8a62", "#fddbc7", "#ffffff", "#e0e0e0", "#999999", "#4d4d4d"],
      "RdGy_8": ["#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#e0e0e0", "#bababa", "#878787", "#4d4d4d"],
      "RdGy_9": ["#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#ffffff", "#e0e0e0", "#bababa", "#878787", "#4d4d4d"],
      "RdGy_10": ["#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#e0e0e0", "#bababa", "#878787", "#4d4d4d", "#1a1a1a"],
      "RdGy_11": ["#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#ffffff", "#e0e0e0", "#bababa", "#878787", "#4d4d4d", "#1a1a1a"],
      "RdYlBu_3": ["#fc8d59", "#ffffbf", "#91bfdb"],
      "RdYlBu_4": ["#d7191c", "#fdae61", "#abd9e9", "#2c7bb6"],
      "RdYlBu_5": ["#d7191c", "#fdae61", "#ffffbf", "#abd9e9", "#2c7bb6"],
      "RdYlBu_6": ["#d73027", "#fc8d59", "#fee090", "#e0f3f8", "#91bfdb", "#4575b4"],
      "RdYlBu_7": ["#d73027", "#fc8d59", "#fee090", "#ffffbf", "#e0f3f8", "#91bfdb", "#4575b4"],
      "RdYlBu_8": ["#d73027", "#f46d43", "#fdae61", "#fee090", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4"],
      "RdYlBu_9": ["#d73027", "#f46d43", "#fdae61", "#fee090", "#ffffbf", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4"],
      "RdYlBu_10": ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee090", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4", "#313695"],
      "RdYlBu_11": ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee090", "#ffffbf", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4", "#313695"],
      "Spectral_3": ["#fc8d59", "#ffffbf", "#99d594"],
      "Spectral_4": ["#d7191c", "#fdae61", "#abdda4", "#2b83ba"],
      "Spectral_5": ["#d7191c", "#fdae61", "#ffffbf", "#abdda4", "#2b83ba"],
      "Spectral_6": ["#d53e4f", "#fc8d59", "#fee08b", "#e6f598", "#99d594", "#3288bd"],
      "Spectral_7": ["#d53e4f", "#fc8d59", "#fee08b", "#ffffbf", "#e6f598", "#99d594", "#3288bd"],
      "Spectral_8": ["#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#e6f598", "#abdda4", "#66c2a5", "#3288bd"],
      "Spectral_9": ["#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#e6f598", "#abdda4", "#66c2a5", "#3288bd"],
      "Spectral_10": ["#9e0142", "#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#e6f598", "#abdda4", "#66c2a5", "#3288bd", "#5e4fa2"],
      "Spectral_11": ["#9e0142", "#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#e6f598", "#abdda4", "#66c2a5", "#3288bd", "#5e4fa2"],
      "RdYlGn_3": ["#fc8d59", "#ffffbf", "#91cf60"],
      "RdYlGn_4": ["#d7191c", "#fdae61", "#a6d96a", "#1a9641"],
      "RdYlGn_5": ["#d7191c", "#fdae61", "#ffffbf", "#a6d96a", "#1a9641"],
      "RdYlGn_6": ["#d73027", "#fc8d59", "#fee08b", "#d9ef8b", "#91cf60", "#1a9850"],
      "RdYlGn_7": ["#d73027", "#fc8d59", "#fee08b", "#ffffbf", "#d9ef8b", "#91cf60", "#1a9850"],
      "RdYlGn_8": ["#d73027", "#f46d43", "#fdae61", "#fee08b", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850"],
      "RdYlGn_9": ["#d73027", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850"],
      "RdYlGn_10": ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee08b", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850", "#006837"],
      "RdYlGn_11": ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850", "#006837"],
      "Accent_3": ["#7fc97f", "#beaed4", "#fdc086"],
      "Accent_4": ["#7fc97f", "#beaed4", "#fdc086", "#ffff99"],
      "Accent_5": ["#7fc97f", "#beaed4", "#fdc086", "#ffff99", "#386cb0"],
      "Accent_6": ["#7fc97f", "#beaed4", "#fdc086", "#ffff99", "#386cb0", "#f0027f"],
      "Accent_7": ["#7fc97f", "#beaed4", "#fdc086", "#ffff99", "#386cb0", "#f0027f", "#bf5b17"],
      "Accent_8": ["#7fc97f", "#beaed4", "#fdc086", "#ffff99", "#386cb0", "#f0027f", "#bf5b17", "#666666"],
      "Dark2_3": ["#1b9e77", "#d95f02", "#7570b3"],
      "Dark2_4": ["#1b9e77", "#d95f02", "#7570b3", "#e7298a"],
      "Dark2_5": ["#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e"],
      "Dark2_6": ["#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e", "#e6ab02"],
      "Dark2_7": ["#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e", "#e6ab02", "#a6761d"],
      "Dark2_8": ["#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e", "#e6ab02", "#a6761d", "#666666"],
      "Paired_3": ["#a6cee3", "#1f78b4", "#b2df8a"],
      "Paired_4": ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c"],
      "Paired_5": ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99"],
      "Paired_6": ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c"],
      "Paired_7": ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f"],
      "Paired_8": ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00"],
      "Paired_9": ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6"],
      "Paired_10": ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a"],
      "Paired_11": ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99"],
      "Paired_12": ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99", "#b15928"],
      "Pastel1_3": ["#fbb4ae", "#b3cde3", "#ccebc5"],
      "Pastel1_4": ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4"],
      "Pastel1_5": ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6"],
      "Pastel1_6": ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", "#ffffcc"],
      "Pastel1_7": ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", "#ffffcc", "#e5d8bd"],
      "Pastel1_8": ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", "#ffffcc", "#e5d8bd", "#fddaec"],
      "Pastel1_9": ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", "#ffffcc", "#e5d8bd", "#fddaec", "#f2f2f2"],
      "Pastel2_3": ["#b3e2cd", "#fdcdac", "#cbd5e8"],
      "Pastel2_4": ["#b3e2cd", "#fdcdac", "#cbd5e8", "#f4cae4"],
      "Pastel2_5": ["#b3e2cd", "#fdcdac", "#cbd5e8", "#f4cae4", "#e6f5c9"],
      "Pastel2_6": ["#b3e2cd", "#fdcdac", "#cbd5e8", "#f4cae4", "#e6f5c9", "#fff2ae"],
      "Pastel2_7": ["#b3e2cd", "#fdcdac", "#cbd5e8", "#f4cae4", "#e6f5c9", "#fff2ae", "#f1e2cc"],
      "Pastel2_8": ["#b3e2cd", "#fdcdac", "#cbd5e8", "#f4cae4", "#e6f5c9", "#fff2ae", "#f1e2cc", "#cccccc"],
      "Set1_3": ["#e41a1c", "#377eb8", "#4daf4a"],
      "Set1_4": ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3"],
      "Set1_5": ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00"],
      "Set1_6": ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33"],
      "Set1_7": ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33", "#a65628"],
      "Set1_8": ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33", "#a65628", "#f781bf"],
      "Set1_9": ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33", "#a65628", "#f781bf", "#999999"],
      "Set2_3": ["#66c2a5", "#fc8d62", "#8da0cb"],
      "Set2_4": ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3"],
      "Set2_5": ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854"],
      "Set2_6": ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f"],
      "Set2_7": ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494"],
      "Set2_8": ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494", "#b3b3b3"],
      "Set3_3": ["#8dd3c7", "#ffffb3", "#bebada"],
      "Set3_4": ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072"],
      "Set3_5": ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3"],
      "Set3_6": ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462"],
      "Set3_7": ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69"],
      "Set3_8": ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5"],
      "Set3_9": ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9"],
      "Set3_10": ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd"],
      "Set3_11": ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd", "#ccebc5"],
      "Set3_12": ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072",
        "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd", "#ccebc5", "#ffed6f"]
    }
  };
};
