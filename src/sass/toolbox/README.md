SASS Styling for fez-frontend
======

__Table of Contents__
* Material Design
* Card Layoutgit
* Content Grid
    * The Grid
    * Sizes
    * 12 Columns
    * Offsets
* Typography
* Helpers
    * Float
    * Overlay
    * Size
    * Text
    * Other
* Responsive helpers
    * Hiding
    * Responsiveness
    * Breakpoints
    * Nesting
    * Multiline
    * Gapless
    * Narrow
* Known issues
    * Material UI & Bulma issues


------

### Material Design

Fez-frontend is based on Material Design, and while we are using Material UI for React as a component library, not all components are included, or adhere to Google's philosophy or specifications. As Material design is considered a "guide" more than strict rules, we have liberty to add functionality as we see, but it must :
* Adhere as closely as possible to Materual Design specifications
* Be usable, and have a UX approach
* Be accessible, and be designed and built for WCAG2.0 AA
* Be minimal, and not make a simple process more drawn out

###Card Layout

Janna has build a Card wrapping component to minimise the potential for misuse (or for future upgrades etc).

However, in general - we have the following format:

```
<Card className="layout-card">
            <CardHeader className="card-header">
                <div className="columns is-gapless is-mobile">
                    <div className="column">
                        {title && <h2 className="title is-4">Card Title</h2>}
                    </div>
                    {help && help.text &&
                    <div className="column is-narrow is-helpicon">
                        <HelpIcon {...help}/>
                    </div>
                    }
                </div>
            </CardHeader>
            <CardText className="body-1">
                <div>
                    Content
                </div>
            </CardText>
        </Card>
```

__NOTE__: The _is-mobile_ assignment to the .columns is to force bulma to render the 2 columns for the card title and the help icon on the same row, rather than return the helpicon to the next row for mobile views.

###Content Grid - [Bulma](http://bulma.io/documentation/grid/columns/)

__The Grid__

Generally, Bulma works on a 12 split columns per row. This allows us to evenly split column sizes into 12 proportional sections.

__General use:__ 

To build a grid, just:
* Add a columns container
* Add as many column elements as you want

```
<div class="columns">
  <div class="column">
    First column
  </div>
  <div class="column">
    Second column
  </div>
  <div class="column">
    Third column
  </div>
  <div class="column">
    Fourth column
  </div>
</div>
```

By default, in a mobile view, these columns will render as 100% wide rows. Add _.is-mobile_ to the .columns to stop this from happening. You can also add _is-multiline_ to allow bulma to space the rows and columns per your sizing specifications - but ALL .column must have a size assigned (ie. _is-3_).

__Sizes__

These are assigned to a .column, and are self explanitory:
* _is-three-quarters_
* _is-two-thirds_
* _is-half_
* _is-one-third_
* _is-one-quarter_

```
<div class="columns">
  <div class="column is-one-quarter">
    <p>
        This area is 25% of the .columns width.
    </p>
  </div>
  <div class="column">
    <p>
        This area will fill in whats left of the .columns (75%).
    </p>
  </div>
</div>
```

__12 Columns__

As the grid can be divided into 12 columns, there are size classes for each division:
* _is-2_
* _is-3_
* _is-4_
* _is-5_
* _is-6_
* _is-7_
* _is-8_
* _is-9_
* _is-10_
* _is-11_


__Offsets__

While you can use empty columns to create horizontal space around .column elements, you can also use offset modifiers like .is-offset-x:

Examples:
* _is-offset-one-quarter_ - Will move the container 25% of the width of the .columns
* _is-offset-8_ - Will move the container to the 9th column of .columns
* _is-offset-1_ - Will move the container to the 2nd column of .columns

###Typography

We are using [Bulma titles](http://bulma.io/documentation/elements/title/) for all titles in fez-frontend. Titles require their h1/h2 assignments for search indexing.

__Page Titles__ (appear at the top of the page)
```
<h1 className="title is-3">Page Title</h1>
```

__Card Titles__ (appear at the top of each card)
```
<h2 className="title is-4">Card Title</h2>
```

__Body copy__
```
<div className="body-1">Body Text</div>
```
### Helpers

We have extracted the [helpers](http://bulma.io/documentation/modifiers/helpers/)and [responsive helpers](http://bulma.io/documentation/modifiers/responsive-helpers/) from Bulma, as their CSS file contained alot of CSS resetting etc we didnt require. You may use these on elements within .column or on .column elements themselves. You can apply these classes to any element for the intended result.

__Float__
* _is-clearfix_ - Fixes an element's floating children
* _is-pulled-left_ - Moves an element to the left
* _is-pulled-right_ - Moves an element to the right

__Overlay__
* _is-overlay_ - Completely covers the first positioned parent

__Size__
* _is-fullwidth_ - Takes up the whole width (100%)

__Text__
* _has-text-centered_ - Centers the text
* _has-text-left_ - Text is left-aligned
* _has-text-right_ - Text is right-aligned

__Other__
* _is-marginless_ - Removes any margin
* _is-paddingless_ - Removes any padding
* _is-unselectable_ - Prevents the text from being selectable
* _is-hidden_ - Hides element

### Responsive helpers

In addition to the helpers above, we also have helpers for responsive elements. These, too, have been extracted from [Bulma responsive helpers](http://bulma.io/documentation/modifiers/responsive-helpers/).

* _is-hidden-mobile_ - Hides the element for mobile only (up to 768px)
* _is-hidden-tablet-only_ - Hides the element for tablets only (769-999px)
* _is-hidden-desktop-only_ - Hides the element for desktop only (1000-1239px)
* _is-hidden-widescreen_ -  Hides the element for widescreen desktops (>1240px)

__Classes to hide up to or from a specific breakpoint__

* _is-hidden-touch_ - Hides for mobile and tablet
* _is-hidden-tablet_ - Hides for tablet, desktop and widescreen
* _is-hidden-desktop_ - hides for desktop and widescreen

__Responsiveness__

By default, columns are only activated from tablet onwards. This means columns are stacked on top of each other on mobile.

If you want columns to work on mobile too, just add the _is-mobile_ class on the columns container:

```
<div class="columns is-mobile">
  <div class="column">1</div>
  <div class="column">2</div>
  <div class="column">3</div>
  <div class="column">4</div>
</div>
```

__Different sizes per breakpoint__

You can define a column size for each viewport size: mobile, tablet, and desktop.

Examples:
* _is-half-mobile_ - On a mobile device, this .column will be 50% of the .columns width
* _is-one-third-tablet_ - On a tablet device only, this .column will be 33% of the .columns width
* _is-one-quarter-desktop_ - Only on desktop, this .column will be 25% of the .columns width

__Nesting__

You can nest columns to have more flexibility in your design. You only need to follow this structure:

* columns: top-level columns container
    * column
        * columns: nested columns
            * column and so on…

__Multiline__

Whenever you want to start a new line, you can close a columns container and start a new one. But you can also add the is-multiline modifier and add more column elements that would fit in a single row.

```
<div class="columns is-multiline is-mobile">
  <div class="column is-one-quarter">
    <code>is-one-quarter</code>
  </div>
  <div class="column is-one-quarter">
    <code>is-one-quarter</code>
  </div>
  <div class="column is-one-quarter">
    <code>is-one-quarter</code>
  </div>
  <div class="column is-one-quarter">
    <code>is-one-quarter</code>
  </div>
  <div class="column is-half">
    <code>is-half</code>
  </div>
  <div class="column is-one-quarter">
    <code>is-one-quarter</code>
  </div>
  <div class="column is-one-quarter">
    <code>is-one-quarter</code>
  </div>
  <div class="column">
    Auto
  </div>
</div>
```

__Gapless__

If you want to remove the space between the columns, add the is-gapless modifier on the columns container:

```
<div class="columns is-gapless">
  <div class="column">First column</div>
  <div class="column">Second column</div>
  <div class="column">Third column</div>
  <div class="column">Fourth column</div>
</div>
```

_.is-gapless-mobile_ is a custom stlye class added to _bulmaHelpers to allow no padding/margins in mobile view only.

__Narrow__

If you want a column to only take the space it needs, use the is-narrow modifier. The other column(s) will fill up the remaining space.

```
<div class="columns">
  <div class="column is-narrow">
    <div class="box" style="width: 200px;">
      <p class="title is-5">Narrow column</p>
      <p class="subtitle">This column is only 200px wide.</p>
    </div>
  </div>
  <div class="column">
    <div class="box">
      <p class="title is-5">Flexible column</p>
      <p class="subtitle">This column will take up the remaining space available.</p>
    </div>
  </div>
</div>
```

As for the size modifiers, you can have narrow columns for different breakpoints:

* _is-narrow-mobile_
* _is-narrow-tablet_
* _is-narrow-desktop_


Material UI & Bulma issues
======

#### MUI Inputs and Buttons in same _.columns_ but different _.column_ on the same row
When placing a MUI input and MUI button in the same row, due to MUI wanting to make space for its floating label, and validation error messages - its height pushes the height of the row out such that the button sits in limbo:

![Before](http://i.imgur.com/ehliZgD.png)

By applying the class _is-mui-spacing-button_ on the button element...

```
<RaisedButton className="is-mui-spacing-button" />
```

...you move the button to meet the input:

![After](http://i.imgur.com/Is1Enyu.png)

NOTE: That this spacing issue doesn't happen when the input and button are in the same cell/.column


