import * as load_viedo from './load_viedo.js';



function fnSearch() {
    print('fnSearch');

    const tx = selector('.search_bar').value;
    load_viedo.searchVideos(tx);
}
function fnSeacrhEnter() {
    if (event.keyCode === 13) {
        fnSearch();
    }
}
selector('.bu_search').addEventListener('click', fnSearch);
selector('.bu_search').addEventListener('keydown', fnSeacrhEnter);
selector('.search_bar').addEventListener('keydown', fnSeacrhEnter);
