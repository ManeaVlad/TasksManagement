import { ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormGroup } from '@angular/forms';
import { Observable, fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

export class FormComponent {
    // @ts-ignore
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    public validationMessages: { [key: string]: { [key: string]: string } } = {};
    public formErrors: { [key: string]: string } = {};

    protected startControlMonitoring(form: FormGroup): void {
        const controlBlurs: Observable<any>[] = this.formInputElements
            .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));
        merge(form.valueChanges, ...controlBlurs).pipe(
            debounceTime(300)
        ).subscribe(value => {
            this.logValidationErrors(form);
        });
    }

    private logValidationErrors(group: FormGroup): void {
        Object.keys(group.controls).forEach((key: string) => {
            const abstractControl = group.get(key);
            this.formErrors[key] = '';
            if (abstractControl && !abstractControl.valid && (abstractControl.touched || abstractControl.dirty)) {
                const messages = this.validationMessages[key];
                for (const errorKey in abstractControl.errors) {
                    if (errorKey) {
                        this.formErrors[key] += messages[errorKey] + ' ';
                    }
                }
            }
            if (abstractControl instanceof FormGroup) {
                this.logValidationErrors(abstractControl);
            }
        });
    }
}
