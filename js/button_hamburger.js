function fnHamburger() {
    print('fnHamburger');

    if (selector('.siderbar').style.visibility == 'hidden') {
        selector('.siderbar').style.visibility = '';
        doc.body.style.paddingLeft = '95px';
    } else {
        selector('.siderbar').style.visibility = 'hidden';
        doc.body.style.paddingLeft = '0px';
    }
}
selector('.img_hamburger').addEventListener('click', fnHamburger);