void main() {
    Thread.currentThread().setName("miles");

    System.out.println(Thread.currentThread().getName());
    System.out.println(Thread.currentThread().getId() + "\n");

    Tonatola tonatola = new Tonatola();
    Thread t1 = new Thread(tonatola);
    t1.setName("villabanks");
    t1.start();

    ElFilosofo elFilosofo = new ElFilosofo();
    elFilosofo.setName("gjini");
    elFilosofo.start();

    for (int i = 0; i < 1000; i++) {
        System.out.println(Thread.currentThread().getName() + " " + i);
    }
}
