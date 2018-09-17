# better-olwlg

Chrome extension that provides enhancements for the [Online Want List Generator](http://bgg.activityclub.org/olwlg).

Current features:

- Restyles the entire application.
- User profiles appear in smaller dropdown cards rather than take up half the screen.
- Better screen reader support on the profile page.
- Better screen reader support on the item listing (Step 3) page.
- Links in comments correctly render in the collection page.


## Accessibility

Better OLWLG modifies some pages with the hope of providing better support for users with disabilities.

Specifically, Better OLWLG modifies the DOM structure with the intention of making all interactive components
comply with accessibility best practices as best as I understand them.
If you have an accessibility feature you'd like added, or know how I can improve the current implementation, please 
log an issue or [message me on Twitter (@AcceptableIce)](https://twitter.com/AcceptableIce). Though I have some experience 
making web applications accessibile, I'm not an accessibilty engineer, and so it's very likely the implementation here
is flawed.

The current accessibility features provided by Better OLWLG:

### Trade Listing Page

- All actionable items are anchors or buttons, and have proper screen reader read-outs.
- The "Add to Wantlist" button next to an item focuses on the first input element in pop-up modal.
- The "Add to Wantlist" pop-up modal focuses back on the "View in Geeklist" anchor in the relevant item's row after the pop-up modal is closed.
- Decoration elements are hidden from screen readers. This includes the icon and color guides, since those visual guides in theory would not be relevant to users with impared vision; I'm not sure if this is better behaviour or not, so please let me know if this is preferred.

### Profile (Settings) Page

- Input elements have labels which correctly focus their related inputs on click.
