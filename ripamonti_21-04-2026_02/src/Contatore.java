public class Contatore implements Runnable {
    @Override
    public void run() {
        System.out.println(Thread.currentThread().getName() + " iniziato");

        for (int i = 1000; i > 0 ; i--) {
            System.out.println(Thread.currentThread().getName() + " " + i);
        }

        System.out.println(Thread.currentThread().getName() + " terminato");
    }
}
