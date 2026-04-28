void main() throws InterruptedException {

    System.out.println("Versione con extends Thread\n");

    ClasseConcorrenteEs4Thread t1 = new ClasseConcorrenteEs4Thread("Thread_Esteso_1");
    ClasseConcorrenteEs4Thread t2 = new ClasseConcorrenteEs4Thread("Thread_Esteso_2");

    t1.start();
    t2.start();

    t1.join();
    t2.join();

    System.out.println("\nVersione con implements Runnable\n");

    ClasseConcorrenteEs4Runnable r1 = new ClasseConcorrenteEs4Runnable();
    ClasseConcorrenteEs4Runnable r2 = new ClasseConcorrenteEs4Runnable();

    Thread tr1 = new Thread(r1);
    Thread tr2 = new Thread(r2);

    tr1.setName("Thread_Runnable_1");
    tr2.setName("Thread_Runnable_2");

    tr1.start();
    tr2.start();

    tr1.join();
    tr2.join();
}

// confronto tra extends Thread e implements Runnable:
//
// extends Thread:
// - La classe estende direttamente Thread, quindi i metodi getName(), getId(), getPriority()
//   sono accessibili direttamente senza passare per Thread.currentThread().
// - Svantaggio: Java non supporta l'ereditarietà multipla, quindi se la classe
//   deve già estendere un'altra classe, non può usare questo approccio.
//
// implements Runnable:
// - La classe implementa solo l'interfaccia Runnable, quindi può ancora estendere
//   un'altra classe liberamente.
// - Per accedere ai dati del thread corrente si usa Thread.currentThread().
// - È possibile passare la stessa istanza di Runnable a più Thread, condividendo lo stato.
// - È l'approccio preferito nella programmazione reale perché:
//   1. Separa il compito (Runnable) dal meccanismo di esecuzione (Thread)
//   2. Permette di usare ExecutorService e thread pool in modo trasparente
//   3. È più flessibile e componibile