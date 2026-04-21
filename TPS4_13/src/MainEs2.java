void main() throws InterruptedException {
    ClasseConcorrenteEs2 cc0 = new ClasseConcorrenteEs2();
    Thread t0 = new Thread(cc0);
    ClasseConcorrenteEs2 cc1 = new ClasseConcorrenteEs2();
    Thread t1 = new Thread(cc1);
    ClasseConcorrenteEs2 cc2 = new ClasseConcorrenteEs2();
    Thread t2 = new Thread(cc2);

    t0.start();
    System.out.println(t0.getState());
    t0.join();
    System.out.println(t0.getState());

    System.out.println("\n-------------------------------\n");

    t1.setPriority(10);
    t2.setPriority(4);

    System.out.println("priorità t1: " + t1.getPriority());
    System.out.println("priorità t2: " + t2.getPriority());

    System.out.println("t1 alive: " + t1.isAlive());
    System.out.println("t2 alive: " + t2.isAlive());

    t1.start();
    t2.start();

    System.out.println("t1 alive: " + t1.isAlive());
    System.out.println("t2 alive: " + t2.isAlive());

    t1.join();
    t2.join();

    System.out.println("t1 alive: " + t1.isAlive());
    System.out.println("t2 alive: " + t2.isAlive());
}

//NEW indica che il thread è stato creato ma la run non è stata chiamata
//RUNNABLE indica che la run è in corso
//TERMINATED indica che la run è stata chiamata ed è terminata

//perché se un thread è troppo corto non si nota la differenza della priorità

//isAlive restituisce true quando lo stato del thread è RUNNABLE