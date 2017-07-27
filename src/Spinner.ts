export interface ISpinnerValue {
	label?: string;
	value: number;
}

export interface ISpinnerOptions {
	values: ISpinnerValue[];
	parentElement: HTMLElement;
	onSelectedValueChanged?: (value: ISpinnerValue) => void;
}

export class Spinner {
	private _valueElements: HTMLElement[];
	private _itemsContainer: HTMLElement;
	private _selectedElement: HTMLElement;
	private _valueElementHeight: number;
	get selectedValue(): ISpinnerValue {
		return this._selectedElement['spinnerValue'];
	}
	
	constructor(private _options: ISpinnerOptions) {
		this._valueElements = _options.values.map(v => this.createValueElement(v));

		this._itemsContainer = document.createElement('div');
		this._itemsContainer.classList.add('spinner-items');
		_options.parentElement.appendChild(this._itemsContainer);
		_options.parentElement.classList.add('spinner');
		this._valueElements.forEach(e => this._itemsContainer.appendChild(e));

		this._valueElementHeight = this._valueElements.map(e => e.clientHeight)[0] || 1;
		const halfParentHeight = _options.parentElement.clientHeight / 2;
		const halfValueHeight = this._valueElementHeight / 2;
		this._itemsContainer.style.paddingTop = `${halfParentHeight - halfValueHeight}px`;
		this._itemsContainer.style.paddingBottom = `${halfParentHeight - halfValueHeight}px`;
		this._itemsContainer.style.position = 'relative'; //important - we need this to measure offset of children

		this._itemsContainer.addEventListener('scroll', event => this.setSelectedElement());

		this.setSelectedElement();
	}

	private _pendingValueChanged: number;
	private setSelectedElement() {
			const index = Math.floor(this._itemsContainer.scrollTop / this._valueElementHeight);
			const newSelection = this._valueElements[index];

			if (newSelection == this._selectedElement) return;

			if (this._selectedElement != null)
				this._selectedElement.classList.remove('selected');

			this._selectedElement = newSelection;

			if (this._selectedElement != null)
				this._selectedElement.classList.add('selected');

			if (this._pendingValueChanged)
				window.clearTimeout(this._pendingValueChanged);

			if (!this._options.onSelectedValueChanged) return;
			
			this._pendingValueChanged	= window.setTimeout(() => this._options.onSelectedValueChanged(this.selectedValue), 100);
	}

	private createValueElement(value: ISpinnerValue): HTMLElement {
		const container = document.createElement('div');
		container.classList.add('spinner-item');
		container.attributes['data-value'] = value.value;
		container['spinnerValue'] = value;
		container.addEventListener('click', () => {
			this._itemsContainer.scrollTop = (container.offsetTop - this._options.parentElement.clientHeight/2) + container.clientHeight;
			this.setSelectedElement();
		})

		const valueElement = document.createElement('span');
		valueElement.classList.add('spinner-value');
		valueElement.innerHTML = '' + value.value;
		container.appendChild(valueElement);

		if (!!value.label) {
			const labelElement = document.createElement('span');
			labelElement.classList.add('spinner-label');
			labelElement.innerHTML = '' + (value.label || '');
			container.appendChild(labelElement);
		}

		return container;
	}
}
