/**
 * Created by Ivan Slobodnychenko on 21.07.17.
 */

$(document).ready(function () {
    $('#side-tabs-init').sideTabs({
        side: 'right',
        position: 'center',
        speed: 200,
        contentWidth: 240,
        responsive: [
            {
                breakpoint: 1300,
                settings: {
                    side: 'bottom',
                    btnSize: 50
                }
            },
            {
                breakpoint: 1200,
                settings: {
                    side: 'right',
                    btnSize: 60
                }
            },
            {
                breakpoint: 1100,
                settings: {
                    side: 'bottom',
                    btnSize: 50
                }
            },
            {
                breakpoint: 600,
                settings: {
                    side: 'bottom',
                    btnSize: 50
                }
            },
        ]
    });
});