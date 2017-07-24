**START**

The plugin allows you to build buttons for calling content on either side of the window.

Execute the ` bower install ` command for installation JQuery and velocity.js.

**HTML**

Example: 
    `<ul class="side-tabs-block" id="side-tabs-init">
        <li class="side-tabs-block__item">
            <img src="" alt="" class="side-tabs-block__icon">
            <div class="side-tabs-block__content">
                <div class="content-inner"></div>
            </div>
        </li>
        <li class="side-tabs-block__item">...</li>
        ...
    </ul>`
    
**INITIALIZATION**

Initialization is performed by list id:

    `$('#side-tabs-init').sideTabs({
        Options
    });`
    
**OPTIONS**

`side: str (right/left/bottom),`
`position: str (top/center/bottom)` // If the side is down, then only the "center" positioning is supported,
`speed: int,
contentWidth: int,
heightContent: str/int,
btnSize: int`

You can override the widget's settings on a different width of the screen with the option "responsive"
Example of using the "responsive":

`responsive: [
     {
         breakpoint: 1200,
         settings: {
             side: 'bottom',
             btnSize: 50
         }
     },
     {
         breakpoint: 992,
         settings: {
             ...
         }
     }
]`
