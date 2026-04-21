void main() throws InterruptedException {
    Contatore mattia = new Contatore();
    Thread salomoni = new Thread(mattia);
    salomoni.setName("Contatore_1");
    Thread aia = new Thread(mattia);
    aia.setName("Contatore_2");

    System.out.println("stato di salomoni: " + salomoni.getState());
    salomoni.start();
    System.out.println("stato di salomoni: " + salomoni.getState());
    salomoni.join();

    aia.setPriority(10);
    Thread.currentThread().setPriority(3);

    System.out.println("stato di salomoni: " + salomoni.getState());

    System.out.println(Thread.currentThread().getName() + " tonatola tonatola tonatola");

    System.out.println(aia.isAlive());
    aia.start();
    System.out.println(aia.isAlive());
}
