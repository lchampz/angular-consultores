import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ConsultorService } from '../../../core/services/consultor.service';
import { Consultor } from '../../../shared/models/consultor';

@Component({
  selector: 'app-consultor-list',
  templateUrl: './consultor-list.component.html',
  styleUrls: ['./consultor-list.component.scss']
})
export class ConsultorListComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = [
    'nome',
    'email',
    'telefone',
    'especialidade',
    'experiencia',
    'ativo',
    'acoes'
  ];
  dataSource = new MatTableDataSource<Consultor>([]);
  loading = false;
  private subscription = new Subscription();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private consultorService: ConsultorService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadConsultores();
    this.subscribeToConsultores();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadConsultores(): void {
    this.loading = true;
    this.consultorService
      .getAll()
      .subscribe({
        next: () => {
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          this.snackBar.open('Erro ao carregar consultores', 'Fechar', {
            duration: 5000
          });
        }
      });
  }

  subscribeToConsultores(): void {
    const sub = this.consultorService.consultores$.subscribe((consultores) => {
      this.dataSource.data = consultores;
    });
    this.subscription.add(sub);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  novoConsultor(): void {
    this.router.navigate(['/consultores/novo']);
  }

  editarConsultor(id: string): void {
    this.router.navigate(['/consultores', id, 'editar']);
  }

  excluirConsultor(consultor: Consultor): void {
    if (confirm(`Deseja realmente excluir o consultor ${consultor.nome}?`)) {
      if (consultor.id) {
        this.consultorService.delete(consultor.id).subscribe({
          next: () => {
            this.snackBar.open('Consultor excluído com sucesso', 'Fechar', {
              duration: 3000
            });
          },
          error: () => {
            this.snackBar.open('Erro ao excluir consultor', 'Fechar', {
              duration: 5000
            });
          }
        });
      }
    }
  }
}
