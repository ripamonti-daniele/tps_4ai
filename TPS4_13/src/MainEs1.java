void main() {
    ClasseConcorrenteEs1 cc1 = new ClasseConcorrenteEs1();
    Thread t1 = new Thread(cc1);
    t1.setName("Thread_1");
    ClasseConcorrenteEs1 cc2 = new ClasseConcorrenteEs1();
    Thread t2 = new Thread(cc2);
    t2.setName("Thread_2");

    t1.start();
    t2.start();

    for (int i = 100; i <= 110; i++) {
        System.out.println(i);
    }
}

//l'ordine di stampa cambia perché l'assegnazione delle risorse viene fatta in modo disponibile in base a quelle presenti e in base alla politica di scheduling
//ogni thread ha un id differente perché il sistema operativo deve essere in grado di identificare ogni thread
