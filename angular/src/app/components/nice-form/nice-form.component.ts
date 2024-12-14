import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { niceForm } from "../../employee";

@Component({
  selector: "app-nice-form",
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: "nice-form.html",
  styles: ``,
})
export class NiceFormComponent {
  @Input() formcontrol!: niceForm[];
  @Output() result = new EventEmitter();

  formgroup!: FormGroup;
  constructor(private fb: FormBuilder) {}
  ngOnInit() {
    this.formgroup = this.fb.group({});

    this.formcontrol.forEach((control) => {
      this.formgroup.addControl(
        control.name,
        new FormControl(control.default, control.validators)
      );
    });
  }

  property_validators_required: ValidatorFn = Validators.required;
  submit() {
    this.result.emit(this.formgroup.getRawValue());
    this.formgroup.reset();
  }

  getValidationClass(controlName: string): string {
    const control = this.formgroup.get(controlName);
    return control?.valid ? "is-valid" : control?.touched ? "is-invalid" : "";
  }
}
