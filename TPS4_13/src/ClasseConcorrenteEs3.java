public class ClasseConcorrenteEs3 implements Runnable {
    @Override
    public void run() {
        for (int i = 1; i <= 10; i++) {
            System.out.println("Thread: " + Thread.currentThread().getName() + " - " + i);
        }
    }
}