void main() {
    ClasseConcorrenteEs3 cc = new ClasseConcorrenteEs3();
    Thread t = new Thread(cc);
    t.setName("Thread_Es3");

    System.out.println("Chiamata diretta a run()");
    System.out.println("Thread corrente prima di run(): " + Thread.currentThread().getName());
    cc.run();
    System.out.println("Thread corrente dopo run(): " + Thread.currentThread().getName());

    System.out.println("\nChiamata a start()");

    t.start();

    System.out.println("Main continua mentre il thread è in esecuzione...");
}

// differenza tra run() e start():
// - run() esegue il codice nel thread corrente (main), come una normale chiamata a metodo.
//   Non c'è concorrenza: il main aspetta che run() finisca prima di continuare.
// - start() crea un nuovo thread del sistema operativo e chiama run() su di esso.
//   Il main e il nuovo thread vengono eseguiti in parallelo (concorrenza reale).
//
// Chiamare run() direttamente non ha senso ai fini della concorrenza:
// è equivalente a chiamare qualsiasi altro metodo, senza alcun parallelismo.