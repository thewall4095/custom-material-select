import { Component, OnInit, ViewChild } from "@angular/core";
import { MultiselectComponent } from "./../../components/multiselect/multiselect.component";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  @ViewChild(MultiselectComponent, { static: true })
  multiSelect: MultiselectComponent;
  //object input
  options = [
    {
      title: "Button",
      path: "demo-button"
    },
    {
      title: "Selection Control",
      path: "demo-selection-control"
    },
    {
      title: "Input",
      path: "demo-input"
    },
    {
      title: "Snackbar",
      path: "demo-snack-bar"
    },
    {
      title: "Chips",
      path: "demo-chips"
    },
    {
      title: "Progress Tabs",
      path: "demo-vertical-tabs"
    }
  ];
  selectedOptions = ["demo-button", "demo-selection-control", "demo-input"];
  selected = this.selectedOptions;
  showError = false;
  errorMessage = "";
  //array input

  optionsArray = ["red","blue","black"];
  selectedOptionsArray = ["red"];
  selectedArray = this.selectedOptions;
  showErrorArray = false;
  errorMessageArray = "";

  constructor() {}

  ngOnInit() {}

  // onToggleDropdown() {
  //   this.multiSelect.toggleDropdown();
  // }

  // resetAll() {
  //   this.selectedOptions = [];
  // }

  getSelectedOptions(selected) {
    this.selected = selected;
  }

  getSelectedOptionsArray(selected) {
    this.selectedArray = selected;
  }
}
