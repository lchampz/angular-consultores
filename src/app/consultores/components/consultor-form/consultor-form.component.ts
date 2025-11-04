import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConsultorService } from '../../../core/services/consultor.service';
import { Consultor } from '../../../shared/models/consultor';

@Component({
  selector: 'app-consultor-form',
  templateUrl: './consultor-form.component.html',
  styleUrls: ['./consultor-form.component.scss']
})
export class ConsultorFormComponent implements OnInit {
  consultorForm!: FormGroup;
  isEditMode = false;
  consultorId?: string;
  loading = false;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private consultorService: ConsultorService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  initForm(): void {
    this.consultorForm = this.fb.group({
      nome: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/)
        ]
      ],
      email: ['', [Validators.required, Validators.email]],
      telefone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)
        ]
      ],
      especialidade: ['', Validators.maxLength(50)],
      experiencia: [
        null,
        [Validators.min(0), Validators.max(50), Validators.pattern(/^\d+$/)]
      ],
      ativo: [true]
    });
  }

  checkEditMode(): void {
    this.consultorId = this.route.snapshot.params['id'];
    if (this.consultorId) {
      this.isEditMode = true;
      this.loadConsultor();
    }
  }

  loadConsultor(): void {
    if (this.consultorId) {
      this.loading = true;
      this.consultorService.getById(this.consultorId).subscribe({
        next: (consultor) => {
          this.consultorForm.patchValue({
            nome: consultor.nome,
            email: consultor.email,
            telefone: consultor.telefone,
            especialidade: consultor.especialidade || '',
            experiencia: consultor.experiencia || null,
            ativo: consultor.ativo !== undefined ? consultor.ativo : true
          });
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.snackBar.open('Erro ao carregar consultor', 'Fechar', {
            duration: 5000
          });
          this.router.navigate(['/consultores']);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.consultorForm.valid && !this.submitting) {
      this.submitting = true;
      const formValue = this.consultorForm.value;

      const consultorData: Omit<Consultor, 'id'> = {
        nome: formValue.nome,
        email: formValue.email,
        telefone: formValue.telefone,
        especialidade: formValue.especialidade || undefined,
        experiencia: formValue.experiencia || undefined,
        ativo: formValue.ativo
      };

      if (this.isEditMode && this.consultorId) {
        this.consultorService
          .update(this.consultorId, consultorData)
          .subscribe({
            next: () => {
              this.snackBar.open('Consultor atualizado com sucesso', 'Fechar', {
                duration: 3000
              });
              this.router.navigate(['/consultores']);
            },
            error: () => {
              this.snackBar.open('Erro ao atualizar consultor', 'Fechar', {
                duration: 5000
              });
              this.submitting = false;
            }
          });
      } else {
        this.consultorService.create(consultorData).subscribe({
          next: () => {
            this.snackBar.open('Consultor criado com sucesso', 'Fechar', {
              duration: 3000
            });
            this.router.navigate(['/consultores']);
          },
          error: () => {
            this.snackBar.open('Erro ao criar consultor', 'Fechar', {
              duration: 5000
            });
            this.submitting = false;
          }
        });
      }
    } else {
      this.markFormGroupTouched(this.consultorForm);
    }
  }

  cancel(): void {
    this.router.navigate(['/consultores']);
  }

  getErrorMessage(controlName: string): string {
    const control = this.consultorForm.get(controlName);
    if (control?.hasError('required')) {
      return 'Campo obrigatório';
    }
    if (control?.hasError('email')) {
      return 'Email inválido';
    }
    if (control?.hasError('minlength')) {
      return `Mínimo de ${control.errors?.['minlength'].requiredLength} caracteres`;
    }
    if (control?.hasError('maxlength')) {
      return `Máximo de ${control.errors?.['maxlength'].requiredLength} caracteres`;
    }
    if (control?.hasError('pattern')) {
      if (controlName === 'nome') {
        return 'Apenas letras e espaços são permitidos';
      }
      if (controlName === 'telefone') {
        return 'Formato inválido. Use (XX) XXXXX-XXXX ou (XX) XXXX-XXXX';
      }
      if (controlName === 'experiencia') {
        return 'Apenas números inteiros são permitidos';
      }
    }
    if (control?.hasError('min')) {
      return `Valor mínimo é ${control.errors?.['min'].min}`;
    }
    if (control?.hasError('max')) {
      return `Valor máximo é ${control.errors?.['max'].max}`;
    }
    return '';
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  get nome(): AbstractControl | null {
    return this.consultorForm.get('nome');
  }

  get email(): AbstractControl | null {
    return this.consultorForm.get('email');
  }

  get telefone(): AbstractControl | null {
    return this.consultorForm.get('telefone');
  }

  get especialidade(): AbstractControl | null {
    return this.consultorForm.get('especialidade');
  }

  get experiencia(): AbstractControl | null {
    return this.consultorForm.get('experiencia');
  }
}
