# NavDrawer Widget [![Appcelerator Titanium](http://www-static.appcelerator.com/badges/titanium-git-badge-sq.png)](http://appcelerator.com/titanium/) [![Appcelerator Alloy](http://www-static.appcelerator.com/badges/alloy-git-badge-sq.png)](http://appcelerator.com/alloy/)

## Description

The NavDrawer widget is a simple sliding side menu.
The widget is licensed under the MIT license.

### DEMO
![NavDrawer Demo](/example/example.gif?raw=true)

## Quick Start

### Get it [![gitTio](http://gitt.io/badge.png)](http://gitt.io/component/com.jpntex.navdrawer)
Download the latest distribution ZIP-file and consult the [Titanium Documentation](http://docs.appcelerator.com/titanium/latest/#!/guide/Using_a_Module) on how install it, or simply use the [gitTio CLI](http://gitt.io/cli):

`$ gittio install com.jpntex.navdrawer`

## Usage
(please jump to step 3 if you are using gitTio)

1. Copy the folder `/com.jpntex.navdrawer` to your `/app/widgets/`

2. In your `/app/config.json` add the widget to the dependencies:

    `"com.jpntex.navdrawer": "0.2"`

3. In your `app/views/index.xml` use it like this:

    ```xml
    <Alloy>
        <Widget id="navDrawer" src="com.jpntex.navdrawer">
            <View role="menu">
                <Label>Menu</Label>
            </View>

            <View role="main" />
        </Widget>
    </Alloy>
    ```

4. In your `app/styles/index.js`:
    ```javascript
    $.navDrawer.open();
    
    var view = Ti.UI.createView({
    	backgroundColor: "#99b3a1"
    });

    // define your initial view
    $.navDrawer.changeView(view);
    ```    

5. In your `app/styles/index.tss`:
    ```css
    "#navDrawer": {
    	overlayShadow: true, // Fade out menu on close
    	menuWidth: 250, // Slide menu width
    	duration: 150, // Close/open animation duration
    	ledge: 40, // Ledge size
    }
    ```

## License
```
Copyright (c) João Teixeira

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
