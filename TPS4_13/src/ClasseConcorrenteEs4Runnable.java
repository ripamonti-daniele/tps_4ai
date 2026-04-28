public class ClasseConcorrenteEs4Runnable implements Runnable {

    @Override
    public void run() {
        System.out.println("Nome: " + Thread.currentThread().getName());
        System.out.println("ID: " + Thread.currentThread().getId() + " | Priorità: " + Thread.currentThread().getPriority());
        for (int i = 1; i <= 15; i++) {
            System.out.println("[" + Thread.currentThread().getName() + "] " + i);
        }
    }
}