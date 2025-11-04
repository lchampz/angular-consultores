import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { tap, catchError, map, take, switchMap } from 'rxjs/operators';
import { Consultor } from '../../shared/models/consultor';

@Injectable({
  providedIn: 'root'
})
export class ConsultorService {
  private collectionName = 'consultores';
  private consultoresCollection: AngularFirestoreCollection<Consultor>;
  private consultoresSubject = new BehaviorSubject<Consultor[]>([]);
  public consultores$: Observable<Consultor[]> = this.consultoresSubject.asObservable();

  constructor(private firestore: AngularFirestore) {
    this.consultoresCollection = this.firestore.collection<Consultor>(this.collectionName);
    // Observar mudanças em tempo real na coleção
    this.consultoresCollection.valueChanges({ idField: 'id' }).subscribe(
      (consultores) => {
        this.consultoresSubject.next(consultores);
      },
      (error) => {
        console.error('Erro ao observar consultores:', error);
      }
    );
  }

  getAll(): Observable<Consultor[]> {
    return this.consultoresCollection.valueChanges({ idField: 'id' }).pipe(
      tap((consultores) => {
        this.consultoresSubject.next(consultores);
      }),
      catchError((error) => {
        console.error('Erro ao buscar consultores:', error);
        return of([]);
      })
    );
  }

  getById(id: string): Observable<Consultor> {
    return this.firestore
      .doc<Consultor>(`${this.collectionName}/${id}`)
      .valueChanges({ idField: 'id' })
      .pipe(
        map((consultor) => {
          if (!consultor) {
            throw new Error('Consultor não encontrado');
          }
          return { ...consultor, id } as Consultor;
        }),
        catchError((error) => {
          console.error(`Erro ao buscar consultor ${id}:`, error);
          throw error;
        })
      );
  }

  create(consultor: Omit<Consultor, 'id'>): Observable<Consultor> {
    const id = this.firestore.createId();
    const consultorComId: Consultor = {
      ...consultor,
      id,
      dataCadastro: new Date(),
      dataAtualizacao: new Date()
    };

    return from(
      this.consultoresCollection
        .doc(id)
        .set(consultorComId)
        .then(() => consultorComId)
    ).pipe(
      tap((novoConsultor) => {
        // O BehaviorSubject será atualizado automaticamente pelo valueChanges
        console.log('Consultor criado:', novoConsultor);
      }),
      catchError((error) => {
        console.error('Erro ao criar consultor:', error);
        throw error;
      })
    );
  }

  update(id: string, consultor: Partial<Consultor>): Observable<Consultor> {
    const dadosAtualizados = {
      ...consultor,
      dataAtualizacao: new Date()
    };

    return from(this.consultoresCollection.doc(id).update(dadosAtualizados)).pipe(
      switchMap(() => this.getById(id).pipe(take(1))),
      tap((consultorAtualizado) => {
        // O BehaviorSubject será atualizado automaticamente pelo valueChanges
        console.log('Consultor atualizado:', consultorAtualizado);
      }),
      catchError((error) => {
        console.error(`Erro ao atualizar consultor ${id}:`, error);
        throw error;
      })
    );
  }

  delete(id: string): Observable<void> {
    return from(this.consultoresCollection.doc(id).delete()).pipe(
      tap(() => {
        // O BehaviorSubject será atualizado automaticamente pelo valueChanges
        console.log('Consultor deletado:', id);
      }),
      catchError((error) => {
        console.error(`Erro ao deletar consultor ${id}:`, error);
        throw error;
      })
    );
  }
}
