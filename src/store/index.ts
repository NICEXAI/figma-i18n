export const langStore = {
	_key: "figma-i18n-lang",
	_status: "",

	get status() {
		if (window && window.localStorage && this._status == "") {
			return localStorage.getItem(this._key)
		}
		return this._status
	},

	set status(val) {
		if (window && window.localStorage) {
			localStorage.setItem(this._key, val)
		}
		this._status = val
	}
}
