import View from "./view.js";
import previewView from "./previewView";
import icons from "url:../../img/icons.svg"


class BookmarksView extends View{
    _parentElement = document.querySelector(".bookmarks__list")
    _errorMessage = "No bookmarks yet. Find one!"
    _message = ""

    addHandlerRender(handler) {
        window.addEventListener("load", handler)
        handler()
    }

    _generateMarkup() {
        return this._data.map(bookmark => previewView.render(bookmark, false)).join('')
    }


}

export default new BookmarksView()