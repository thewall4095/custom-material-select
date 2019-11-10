import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
  DoCheck
} from '@angular/core';
import { FormControl } from '@angular/forms';

// tslint:disable-next-line: no-conflicting-lifecycle
@Component({
  selector: 'app-multiselect',
  templateUrl: "multiselect.component.html",
  styleUrls: ["./multiselect.component.scss"]
})

export class MultiselectComponent implements OnChanges, DoCheck {
  @Input() selectPlaceholder: string = "search...";
  @Input() placeholder: string;
  @Input() options;
  @Input() disabled = false;
  @Input() display = "display";
  @Input() value = "value";
  @Input() formControl: FormControl = new FormControl();
  @Input() errorMsg: string = "Field is required";
  @Input() showErrorMsg = false;
  @Input() selectedOptions;
  @Input() multiple = true;

  // New Options
  @Input() labelCount: number = 1;
  @Input() appearance: "standard" | "fill" | "outline" = "standard";

  @Output()
  selectionChange: EventEmitter<any> = new EventEmitter();

  @ViewChild("selectElem", {static: true}) selectElem;
  isInputArray :boolean = false;
  filteredOptions: Array<any> = [];
  selectedValue: Array<any> = [];
  selectAllChecked = false;
  displayString = "";
  constructor() {}

  ngOnChanges() {
    if (this.disabled) {
      this.formControl.disable();
    } else {
      this.formControl.enable();
    }
    this.filteredOptions = this.options;
    if(typeof(this.options[0]) == "string"){
      this.isInputArray = true;
    }
    if (this.selectedOptions) {
      this.selectedValue = this.selectedOptions;
    } else if (this.formControl.value) {
      this.selectedValue = this.formControl.value;
    }
  }

  ngDoCheck() {
    if (!this.selectedValue.length) {
      this.selectionChange.emit(this.selectedValue);
    }
  }

  toggleDropdown() {
    this.selectElem.toggle();
  }

  toggleSelectAll(val) {
    if (val.checked) {
      this.filteredOptions.forEach(option => {
        if(this.isInputArray){
          if (!this.selectedValue.includes(option)) {
            this.selectedValue = this.selectedValue.concat([option]);
          }
        }else{
          if (!this.selectedValue.includes(option[this.value])) {
            this.selectedValue = this.selectedValue.concat([option[this.value]]);
          }
        }
      });
    } else {
      const filteredValues = this.getFilteredOptionsValues();
      this.selectedValue = this.selectedValue.filter(
        item => !filteredValues.includes(item)
      );
    }
    this.selectionChange.emit(this.selectedValue);
  }

  filterItem(value) {

    if(this.isInputArray){
      this.filteredOptions = this.options.filter(
        item => item.toLowerCase().indexOf(value.toLowerCase()) > -1
      );

      this.selectAllChecked = true;
      this.filteredOptions.forEach(item => {
        if (!this.selectedValue.includes(item)) {
          this.selectAllChecked = false;
        }
      });
    }else{
      this.filteredOptions = this.options.filter(
        item => item[this.display].toLowerCase().indexOf(value.toLowerCase()) > -1
      );
      this.selectAllChecked = true;
      this.filteredOptions.forEach(item => {
        if (!this.selectedValue.includes(item)) {
          this.selectAllChecked = false;
        }
      });
    }

    if (!this.filteredOptions.length) {
      this.selectAllChecked = false;
    }
  }

  hideOption(option) {
    return !(this.filteredOptions.indexOf(option) > -1);
  }

  // Returns plain strings array of filtered values
  getFilteredOptionsValues() {
    const filteredValues = [];
    if(this.isInputArray){
      this.filteredOptions.forEach(option => {
        filteredValues.push(option);
      });
    }else{
      this.filteredOptions.forEach(option => {
        filteredValues.push(option.value);
      });
    }

    return filteredValues;
  }

  onDisplayString() {
    this.displayString = "";
    if (this.selectedValue && this.selectedValue.length) {
      let displayOption = [];
      if (this.multiple) {
        // Multi select display
        if(this.isInputArray){
          for (let i = 0; i < this.labelCount; i++) {
            displayOption[i] = this.options.filter(
              option => option === this.selectedValue[i]
            )[0];
          }
        }else {
          for (let i = 0; i < this.labelCount; i++) {
            displayOption[i] = this.options.filter(
              option => option[this.value] === this.selectedValue[i]
            )[0];
          }
        }

        if (displayOption.length) {
        if(this.isInputArray){
          for (let i = 0; i < displayOption.length; i++) {
            if (displayOption[i] && displayOption[i]) {
              this.displayString += displayOption[i] + ",";
            }
          }
        }else{
          for (let i = 0; i < displayOption.length; i++) {
            if (displayOption[i] && displayOption[i][this.display]) {
              this.displayString += displayOption[i][this.display] + ",";
            }
          }
        }

          this.displayString = this.displayString.slice(0, -1);
          if (
            this.selectedValue.length > 1 &&
            this.selectedValue.length > this.labelCount
          ) {
            this.displayString += ` (+${this.selectedValue.length -
              this.labelCount} others)`;
          }
        }
      } else {
        // Single select display
        if(this.isInputArray){
          displayOption = this.options.filter(
            option => option === this.selectedValue
          );
          if (displayOption.length) {
            this.displayString = displayOption[0];
          }
        }else{
          displayOption = this.options.filter(
            option => option[this.value] === this.selectedValue
          );
          if (displayOption.length) {
            this.displayString = displayOption[0][this.display];
          }
        }
      }
    }
    return this.displayString;
  }

  onSelectionChange(val) {
    const filteredValues = this.getFilteredOptionsValues();
    let count = 0;
    if (this.multiple) {
      this.selectedValue.filter(item => {
        if (filteredValues.includes(item)) {
          count++;
        }
      });
      this.selectAllChecked = count === this.filteredOptions.length;
    }
    this.selectedValue = val.value;
    this.selectionChange.emit(this.selectedValue);
  }

  public trackByFn(item) {
    return item.value;
  }

  clear() {
    this.selectedValue = [];
  }

  submit(){
    this.toggleDropdown();
  }
}
